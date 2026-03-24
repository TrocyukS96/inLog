'use client'

import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminPanelNodeTab } from '../../../../entities/admin/model/types'
import { Button } from '../../../../shared/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../../../../shared/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../../shared/ui/dropdown-menu'
import { Input } from '../../../../shared/ui/input'
import { Label } from '../../../../shared/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../shared/ui/tabs'

const ConstructorTabs = ({ tabs }: { tabs: AdminPanelNodeTab[] }) => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en'
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newTabName, setNewTabName] = useState({ ru: '', en: '' })

    const handleCreateTab = () => {
        setIsModalOpen(false)
        setNewTabName({ ru: '', en: '' })
    }

        // const handleAddTab = useCallback(() => {
    //     setTabs((prev) => [
    //         ...prev,
    //         {
    //             id: prev.length > 0 ? prev[prev.length - 1]?.id! + 1 : 0,
    //             group: node?.id!,
    //             name_en: '',
    //             name_ru: '',
    //             lang: i18n.language === 'ru' ? 'ru' : 'en',
    //         },
    //     ])
    // }, [node?.id, i18n.language])

    return (
        <div>
            {tabs.length === 0 && (
                <div className="h-full flex items-center justify-center flex-col gap-2">
                    <p className="text-muted-foreground">
                        {t('admin-page.no-tabs-available')}
                    </p>
                    <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                        {t('admin-page.create-tab')}
                    </Button>
                </div>
            )}

            {
                tabs.length > 0 && (
                    <Tabs defaultValue={tabs[0]?.id?.toString()}>
                        <TabsList className="flex-wrap h-auto">
                            {tabs.map((tab) => (
                                <div key={tab.id} className="relative">
                                    <TabsTrigger
                                        value={tab.id!.toString()}
                                        className="group data-[state=active]:bg-background pr-8"
                                    >
                                        <span className="hidden sm:inline">{tab[`name_${currentLang}`]}</span>
                                    </TabsTrigger>

                                    {/* Меню вынесено отдельно, позиционируется поверх таба */}
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => { }}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>{t('buttons.edit')}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => { }}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>{t('buttons.delete')}</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {/* Таб с плюсиком для добавления нового таба */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsModalOpen(true)}
                                className="h-9 px-3 gap-1 text-muted-foreground hover:text-foreground"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('admin-page.add-tab')}</span>
                            </Button>
                        </TabsList>

                        {tabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id!.toString()}>
                                <div className="p-4">
                                    {/* Здесь будет контент таба */}
                                    <p>Constructor tabs - {tab[`name_${currentLang}`]}</p>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                )
            }

            {/* Модальное окно для создания нового таба */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('admin-page.create-new-tab')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name-ru">
                                {t('fields.name-in-russian')}
                            </Label>
                            <Input
                                id="name-ru"
                                value={newTabName.ru}
                                onChange={(e) => setNewTabName({ ...newTabName, ru: e.target.value })}
                                className="w-full"
                                placeholder={t('fields.enter-name-in-russian')}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name-en">
                                {t('fields.name-in-english')}
                            </Label>
                            <Input
                                id="name-en"
                                value={newTabName.en}
                                onChange={(e) => setNewTabName({ ...newTabName, en: e.target.value })}
                                className="w-full"
                                placeholder={t('fields.enter-name-in-english')}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            {t('buttons.cancel')}
                        </Button>
                        <Button onClick={handleCreateTab}>
                            {t('buttons.create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ConstructorTabs