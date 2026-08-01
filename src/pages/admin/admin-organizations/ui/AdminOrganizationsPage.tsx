import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { AdminOrganization } from '../../../../entities/platform-admin/model/types'
import {
  useDeleteAdminOrganizationMutation,
  useGetAdminOrganizationsQuery,
} from '../../../../entities/platform-admin/model/platformAdminSlice'
import { ADMIN_PAGE_SIZE, formatAdminDateShort } from '../../../../features/platform-admin/lib/format'
import { useAdminDeleteDialog } from '../../../../features/platform-admin/lib/useAdminDeleteDialog'
import { AdminDeleteConfirmDialog } from '../../../../features/platform-admin/ui/AdminDeleteConfirmDialog'
import { AdminOrganizationEditDialog } from '../../../../features/platform-admin/ui/AdminOrganizationEditDialog'
import { AdminPagination } from '../../../../features/platform-admin/ui/AdminPagination'
import { AdminSearchBar } from '../../../../features/platform-admin/ui/AdminSearchBar'
import { AdminSectionShell } from '../../../../features/platform-admin/ui/AdminSectionShell'
import { Badge } from '../../../../shared/ui/badge'
import { Button } from '../../../../shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/ui/table'

export function AdminOrganizationsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [editingOrganization, setEditingOrganization] = useState<AdminOrganization | null>(null)

  const { data, isLoading, isFetching } = useGetAdminOrganizationsQuery({
    limit: ADMIN_PAGE_SIZE,
    offset,
    search: appliedSearch || undefined,
  })
  const [deleteOrganization, { isLoading: isDeletingOrg }] = useDeleteAdminOrganizationMutation()
  const { target, isDeleting, openDeleteDialog, closeDeleteDialog, confirmDelete } =
    useAdminDeleteDialog()

  const organizations = data?.results ?? []
  const isBusy = isLoading || isFetching || isDeletingOrg || isDeleting

  const handleDelete = (organization: AdminOrganization) => {
    openDeleteDialog({
      type: 'organization',
      name: organization.full_name,
      onConfirm: async () => {
        try {
          await deleteOrganization(organization.id).unwrap()
          toast.success(t('admin-page.organization-deleted'))
        } catch (error) {
          toast.error(t('errors.something-went-wrong'))
          console.error(error)
          throw error
        }
      },
    })
  }

  return (
    <>
      <AdminSectionShell
        title={t('admin-page.organizations')}
        description={t('admin-page.organizations-description')}
        isLoading={isLoading}
        isEmpty={!isLoading && organizations.length === 0}
        toolbar={
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => {
              setAppliedSearch(search.trim())
              setOffset(0)
            }}
            placeholder={t('admin-page.search-organizations')}
            actionLabel={t('admin-page.search')}
          />
        }
        footer={
          data ? (
            <AdminPagination
              count={data.count}
              offset={offset}
              limit={ADMIN_PAGE_SIZE}
              onChange={setOffset}
              isLoading={isBusy}
            />
          ) : null
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t('admin-page.orgs-table.name')}</TableHead>
              <TableHead>{t('admin-page.orgs-table.short-name')}</TableHead>
              <TableHead>{t('admin-page.orgs-table.inn')}</TableHead>
              <TableHead>{t('admin-page.orgs-table.members')}</TableHead>
              <TableHead>{t('admin-page.orgs-table.projects')}</TableHead>
              <TableHead>{t('admin-page.orgs-table.created')}</TableHead>
              <TableHead className="text-right">{t('admin-page.users-table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="text-muted-foreground">#{org.id}</TableCell>
                <TableCell className="max-w-[240px] truncate font-medium">{org.full_name}</TableCell>
                <TableCell>{org.short_name}</TableCell>
                <TableCell>{org.inn || '—'}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{org.members_count}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{org.projects_count}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatAdminDateShort(org.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isBusy}
                      onClick={() => setEditingOrganization(org)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isBusy}
                      onClick={() => handleDelete(org)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminSectionShell>

      <AdminOrganizationEditDialog
        organization={editingOrganization}
        open={Boolean(editingOrganization)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingOrganization(null)
          }
        }}
      />

      <AdminDeleteConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog()
          }
        }}
        entityType={target?.type ?? 'organization'}
        entityName={target?.name ?? ''}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
