import { CustomFieldList } from '@/features/custom-fields/components/CustomFieldList'

export default function FieldsSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Campos Personalizados</h1>
      <CustomFieldList />
    </div>
  )
}
