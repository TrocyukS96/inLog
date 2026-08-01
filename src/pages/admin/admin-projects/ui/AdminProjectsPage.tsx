import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { AdminProject } from '../../../../entities/platform-admin/model/types'
import {
  useDeleteAdminProjectMutation,
  useGetAdminProjectsQuery,
} from '../../../../entities/platform-admin/model/platformAdminSlice'
import { ADMIN_PAGE_SIZE, formatAdminDateShort } from '../../../../features/platform-admin/lib/format'
import { useAdminDeleteDialog } from '../../../../features/platform-admin/lib/useAdminDeleteDialog'
import { AdminDeleteConfirmDialog } from '../../../../features/platform-admin/ui/AdminDeleteConfirmDialog'
import { AdminPagination } from '../../../../features/platform-admin/ui/AdminPagination'
import { AdminProjectEditDialog } from '../../../../features/platform-admin/ui/AdminProjectEditDialog'
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

export function AdminProjectsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null)

  const { data, isLoading, isFetching } = useGetAdminProjectsQuery({
    limit: ADMIN_PAGE_SIZE,
    offset,
    search: appliedSearch || undefined,
  })
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteAdminProjectMutation()
  const { target, isDeleting, openDeleteDialog, closeDeleteDialog, confirmDelete } =
    useAdminDeleteDialog()

  const projects = data?.results ?? []
  const isBusy = isLoading || isFetching || isDeletingProject || isDeleting

  const handleDelete = (project: AdminProject) => {
    openDeleteDialog({
      type: 'project',
      name: project.name,
      onConfirm: async () => {
        try {
          await deleteProject(project.id).unwrap()
          toast.success(t('admin-page.project-deleted'))
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
        title={t('admin-page.projects')}
        description={t('admin-page.projects-description')}
        isLoading={isLoading}
        isEmpty={!isLoading && projects.length === 0}
        toolbar={
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            onSubmit={() => {
              setAppliedSearch(search.trim())
              setOffset(0)
            }}
            placeholder={t('admin-page.search-projects')}
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
              <TableHead>{t('admin-page.projects-table.name')}</TableHead>
              <TableHead>{t('admin-page.projects-table.organization')}</TableHead>
              <TableHead>{t('admin-page.projects-table.country')}</TableHead>
              <TableHead>{t('admin-page.projects-table.members')}</TableHead>
              <TableHead>{t('admin-page.projects-table.created')}</TableHead>
              <TableHead className="text-right">{t('admin-page.users-table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="text-muted-foreground">#{project.id}</TableCell>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{project.organization_name || '—'}</span>
                    <span className="text-xs text-muted-foreground">#{project.organization_id}</span>
                  </div>
                </TableCell>
                <TableCell>{project.country || '—'}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{project.members_count}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatAdminDateShort(project.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isBusy}
                      onClick={() => setEditingProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isBusy}
                      onClick={() => handleDelete(project)}
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

      <AdminProjectEditDialog
        project={editingProject}
        open={Boolean(editingProject)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProject(null)
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
        entityType={target?.type ?? 'project'}
        entityName={target?.name ?? ''}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
