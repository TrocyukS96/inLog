import {
  ChevronRight,
  FolderKanban,
  ListTodo,
  Map
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '../../shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card'



import { routes } from '../../shared/lib/routes'

// const organizationSchema = z.object({
//   fullName: z.string().min(1, 'Введите полное название'),
//   shortName: z.string().min(1, 'Введите краткое название'),
//   address: z.string().min(1, 'Введите адрес'),
// })

// const projectSchema = z.object({
//   name: z.string().min(1, 'Введите название проекта'),
//   organizationId: z.number().min(1, 'Выберите организацию'),
// })

// type OrganizationForm = z.infer<typeof organizationSchema>
// type ProjectForm = z.infer<typeof projectSchema>

export default function DashboardPage() {
  const { t } = useTranslation()

  // Организации


//   // Форма организации
//   const orgForm = useForm<OrganizationForm>({
//     resolver: zodResolver(organizationSchema),
//     defaultValues: { fullName: '', shortName: '', address: '' },
//   })

//   // Форма проекта
//   const projectForm = useForm<ProjectForm>({
//     resolver: zodResolver(projectSchema),
//     defaultValues: { name: '', organizationId: 0 },
//   })

  // Удалить организацию




  return (
    <div className="space-y-10">
      <Card className="m-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Добро пожаловать в inLog
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Лабораторная информационная система для управления исследованиями керна и данными скважин
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Здесь вы можете создавать организации, проекты, загружать данные по кустам, скважинам, кернам, проводить измерения и отслеживать статусы.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickLinkCard
              icon={<FolderKanban className="h-6 w-6" />}
              title={t('projects')}
              description="Управление проектами и кустами"
              to={routes.projects.list()}
            />
            <QuickLinkCard
              icon={<ListTodo className="h-6 w-6" />}
              title={t('tasks')}
              description="Планирование задач и статусов"
              to={routes.scheduler.tasks()}
            />
            <QuickLinkCard
              icon={<Map className="h-6 w-6" />}
              title={t('roadmap')}
              description="Дорожная карта исследований"
              to={routes.scheduler.roadmap()}
            />
          </div>
        </CardContent>
      </Card>

  
    </div>
  )
}

function QuickLinkCard({
  icon,
  title,
  description,
  to,
}: {
  icon: React.ReactNode
  title: string
  description: string
  to: string
}) {
  return (
    <Button asChild variant="outline" className="h-auto py-6 px-6 flex flex-col items-start gap-2 hover:bg-primary/5">
      <Link to={to}>
        <div className="text-primary">{icon}</div>
        <div className="font-medium">{title}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <ChevronRight className="h-4 w-4 mt-2" />
      </Link>
    </Button>
  )
}