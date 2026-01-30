import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../shared/ui/form'
import { Input } from '../../../shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select'
import { Button } from '../../../shared/ui/button'
import type { Task } from '../../../entities/task/model/types'

interface Props {
  onCreate: (name: string, priority: Task['priority']) => void
}

const CreateTaskForm = ({ onCreate }: Props) => {
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(1, t('validation.enter-name')),
    priority: z.enum(['low', 'medium', 'important', 'critical']),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', priority: 'medium' },
  })

  const onSubmit = (values: z.infer<typeof schema>) => {
    onCreate(values.name, values.priority as Task['priority'])
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.task-name')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('fields.enter-task-name')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.priority')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fields.select-priority')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">{t('fields.low')}</SelectItem>
                  <SelectItem value="medium">{t('fields.medium')}</SelectItem>
                  <SelectItem value="important">{t('fields.important')}</SelectItem>
                  <SelectItem value="critical">{t('fields.critical')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t('fields.create')}
        </Button>
      </form>
    </Form>
  )
}


export default CreateTaskForm