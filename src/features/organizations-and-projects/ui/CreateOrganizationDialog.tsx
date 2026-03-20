import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/dialog"
import { Button } from "../../../shared/ui/button"
import { Input } from "../../../shared/ui/input"
import { Label } from "../../../shared/ui/label"
import { Loader2 } from "lucide-react"
import { useAddOrganizationMutation } from "../../../entities/organization/model/organizationSlice"
import { errorsHandler } from "../../../shared/lib/errors-handler"

interface CreateOrganizationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const CreateOrganizationDialog = ({ open, onOpenChange }: CreateOrganizationDialogProps) => {
    const { t } = useTranslation()
    const [addOrganization, { isLoading }] = useAddOrganizationMutation()
    
    const [formData, setFormData] = useState({
        fullName: "",
        shortName: "",
        address: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.creating-organization'))
            await addOrganization({
                full_name: formData.fullName,
                short_name: formData.shortName,
                address: formData.address,
            }).unwrap()
            toast.success(t('notice-list.organization-created'))
            onOpenChange(false)
            setFormData({ fullName: "", shortName: "", address: "" })
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('settings-page.create-organization')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">{t('fields.full-name')}</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="shortName">{t('fields.short-name')}</Label>
                        <Input
                            id="shortName"
                            value={formData.shortName}
                            onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">{t('fields.address')}</Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('buttons.cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {t('buttons.create')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}