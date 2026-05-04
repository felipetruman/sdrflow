import { CustomFieldList } from '@/features/custom-fields/components/CustomFieldList'

export default function FieldsSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:px-6 md:py-8">
      <header className="space-y-2 pb-4">
        <p className="eyebrow">Configuração</p>
        <h1 className="font-display text-paper text-3xl font-semibold tracking-tight md:text-4xl">
          Campos Personalizados
        </h1>
        <p className="text-paper-muted max-w-prose text-sm">
          Adicione campos extras para qualificar leads conforme o seu processo de vendas.
        </p>
      </header>

      <div className="hairline" aria-hidden />

      <CustomFieldList />
    </div>
  )
}
