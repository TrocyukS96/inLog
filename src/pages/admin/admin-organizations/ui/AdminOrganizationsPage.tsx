import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAdminOrganizationsQuery } from '../../../../entities/platform-admin/model/platformAdminSlice'
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

export function AdminOrganizationsPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [offset, setOffset] = useState(0)

  const { data, isLoading, isFetching } = useGetAdminOrganizationsQuery({
    limit: ADMIN_PAGE_SIZE,
    offset,
    search: appliedSearch || undefined,
  })

  const organizations = data?.results ?? []

  return (
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
            isLoading={isFetching}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminSectionShell>
  )
}
