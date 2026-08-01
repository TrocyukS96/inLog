import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAdminProjectsQuery } from '../../../../entities/platform-admin/model/platformAdminSlice'
import { ADMIN_PAGE_SIZE, formatAdminDateShort } from '../../../../features/platform-admin/lib/format'
import { AdminPagination } from '../../../../features/platform-admin/ui/AdminPagination'
import { AdminSearchBar } from '../../../../features/platform-admin/ui/AdminSearchBar'
import { AdminSectionShell } from '../../../../features/platform-admin/ui/AdminSectionShell'
import { Badge } from '../../../../shared/ui/badge'
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

  const { data, isLoading, isFetching } = useGetAdminProjectsQuery({
    limit: ADMIN_PAGE_SIZE,
    offset,
    search: appliedSearch || undefined,
  })

  const projects = data?.results ?? []

  return (
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
            isLoading={isFetching}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminSectionShell>
  )
}
