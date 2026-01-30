import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { useGetOrganizationsQuery } from '../../../entities/organization/model/organizationSlice'
import { useGetProjectsQuery } from '../../../entities/project/model/projectSlice'
import { Button } from '../../../shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../shared/ui/form'
import { Input } from '../../../shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select'

export default function OrgProjectSelector() {
    const { t } = useTranslation()
    const [orgOpen, setOrgOpen] = useState(false)
    const [projOpen, setProjOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const [currentOrgId, setCurrentOrgId] = useState<number | null>(Number(searchParams.get('org')) || null)
    const [currentProjectId, setCurrentProjectId] = useState<number | null>(Number(searchParams.get('project')) || null)

    const { data: organizations = [], isLoading: orgsLoading } = useGetOrganizationsQuery()

    const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery(
        { organization: currentOrgId! },
        { skip: !currentOrgId }
    )

    const [addOrgLoading, _setAddOrgLoading] = useState(false)
    const [addProjLoading, _setAddProjLoading] = useState(false)

    const orgSchema = z.object({
        fullName: z.string().min(1, t('fields.enter-full-name')),
        shortName: z.string().min(1, t('fields.enter-short-name')),
        address: z.string().min(1, t('fields.enter-address')),
    })

    const projectSchema = z.object({
        name: z.string().min(1, t('fields.enter-project-name')),
    })

    useEffect(() => {
        const orgParam = searchParams.get('org')
        const projectParam = searchParams.get('project')

        if (orgParam && Number(orgParam)) {
            setCurrentOrgId(Number(orgParam))
        }

        if (projectParam && Number(projectParam)) {
            setCurrentProjectId(Number(projectParam))
        }
    }, [searchParams])

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (currentOrgId) {
            params.set('org', currentOrgId.toString())
        } else {
            params.delete('org')
        }

        if (currentProjectId) {
            params.set('project', currentProjectId.toString())
        } else {
            params.delete('project')
        }

        setSearchParams(params, { replace: true })
    }, [currentOrgId, currentProjectId, searchParams, setSearchParams])

    // Форма организации
    const orgForm = useForm<z.infer<typeof orgSchema>>({
        resolver: zodResolver(orgSchema),
        defaultValues: { fullName: '', shortName: '', address: '' },
    })

    // Форма проекта
    const projForm = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: { name: '' },
    })

    const onAddOrg = async (_values: z.infer<typeof orgSchema>) => {
        try {
            // const response = await addOrg(values).unwrap()
            toast.success(t('organization-created'))
            // dispatch(setCurrentOrganization(response.id))
            setOrgOpen(false)
            orgForm.reset()
        } catch {
            toast.error(t('error-creating-organization'))
        }
    }

    const onAddProj = async (_values: z.infer<typeof projectSchema>) => {
        if (!currentOrgId) {
            toast.error(t('select-organization-first'))
            return
        }

        try {
            // const response = await addProject({ ...values, organization: currentOrgId }).unwrap()
            toast.success(t('project-created'))
            // dispatch(setCurrentProject(response.id))
            setProjOpen(false)
            projForm.reset()
        } catch {
            toast.error(t('error-creating-project'))
        }
    }

    if (orgsLoading || projectsLoading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 px-4 py-4 bg-card rounded-lg border border-border">
            {/* Организация */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {t('scheduler-page.organization')}
                    </span>
                    <Dialog open={orgOpen} onOpenChange={setOrgOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{t('scheduler-page.new-organization')}</DialogTitle>
                            </DialogHeader>

                            {/* Важно: форма обёрнута в <Form> */}
                            <Form {...orgForm}>
                                <form onSubmit={orgForm.handleSubmit(onAddOrg)} className="space-y-4">
                                    <FormField
                                        control={orgForm.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('fields.full-name')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={t('fields.enter-full-name')} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={orgForm.control}
                                        name="shortName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('fields.short-name')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={t('fields.enter-short-name')} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={orgForm.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('fields.address')}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder={t('fields.enter-address')} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={addOrgLoading}>
                                        {addOrgLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        {t('scheduler-page.create-organization')}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {organizations.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-2">
                        {t('scheduler-page.no-organizations-yet')}
                    </div>
                ) : (
                    <Select
                        value={currentOrgId?.toString() || ''}
                        onValueChange={(value) => {
                            const id = Number(value)
                            setCurrentOrgId(id)
                            setCurrentProjectId(null) // сбрасываем проект
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('scheduler-page.select-organization-first')} />
                        </SelectTrigger>
                        <SelectContent>
                            {organizations.map(org => (
                                <SelectItem key={org.id} value={org.id.toString()}>
                                    {org.fullName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Проект */}
            {currentOrgId && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t('scheduler-page.projects')}
                        </span>
                        <Dialog open={projOpen} onOpenChange={setProjOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{t('scheduler-page.new-project')}</DialogTitle>
                                </DialogHeader>

                                {/* Важно: форма обёрнута в <Form> */}
                                <Form {...projForm}>
                                    <form onSubmit={projForm.handleSubmit(onAddProj)} className="space-y-4">
                                        <FormField
                                            control={projForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('fields.project-name')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder={t('fields.enter-project-name')} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={addProjLoading}>
                                            {addProjLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                            {t('scheduler-page.create-project')}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-2">
                            {t('scheduler-page.no-projects-in-organization')}
                        </div>
                    ) : (
                        <Select
                            value={currentProjectId?.toString() || ''}
                            onValueChange={(value) => setCurrentProjectId(Number(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('scheduler-page.select-project-first')} />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map(proj => (
                                    <SelectItem key={proj.id} value={proj.id.toString()}>
                                        {proj.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            )}
        </div>
    )
}