"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FormValues } from "@/types/formClient"
import { createForm } from "../action/createForm"
import RadioField from "@/hooks/radio-field-hook"


type Resultado = {
  probabilidade_churn: number
  risco: string
  acao: string
}


export default function FormCliente() {
  const { control, register, handleSubmit } = useForm<FormValues>()
  const [resultado, setResultado] = React.useState<Resultado | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(data: FormValues) {
    setLoading(true)
    try {
      const res = await createForm(data)
      setResultado(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
    
  const simNao = [
    { label: "Sim", value: "Yes" },
    { label: "Não", value: "No" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Previsão de Churn</CardTitle>
        <CardDescription>Preencha os dados do cliente para prever o risco de cancelamento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 ">

          {/* DADOS PESSOAIS */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <h3 className="font-semibold text-base border-b pb-2">Dados Pessoais</h3>
              <RadioField label="Senior Citizen" name="SeniorCitizen" control={control} options={[{ label: "Sim", value: "1" }, { label: "Não", value: "0" }]} />
              <RadioField label="Possui Parceiro?" name="Partner" control={control} options={simNao} />
              <RadioField label="Possui Dependentes?" name="Dependents" control={control} options={simNao} />
          </div>

          {/* SERVIÇOS CONTRATADOS */}
          <div className="flex flex-col gap-4 jusit">
            <h3 className="font-semibold text-base border-b pb-2">Serviços Contratados</h3>
            <RadioField label="Múltiplas Linhas" name="MultipleLines" control={control}
              options={[{ label: "Sim", value: "Yes" }, { label: "Não", value: "No" }, { label: "Sem telefone", value: "No phone service" }]} />
            <RadioField label="Serviço de Internet" name="InternetService" control={control}
              options={[{ label: "DSL", value: "DSL" }, { label: "Fibra Óptica", value: "Fiber optic" }, { label: "Sem internet", value: "No" }]} />
            <RadioField label="Segurança Online" name="OnlineSecurity" control={control} options={simNao} />
            <RadioField label="Backup Online" name="OnlineBackup" control={control} options={simNao} />
            <RadioField label="Proteção de Dispositivo" name="DeviceProtection" control={control} options={simNao} />
            <RadioField label="Suporte Técnico" name="TechSupport" control={control} options={simNao} />
            <RadioField label="Streaming TV" name="StreamingTV" control={control} options={simNao} />
            <RadioField label="Streaming Filmes" name="StreamingMovies" control={control} options={simNao} />
          </div>

          {/* CONTRATO E PAGAMENTO */}
          <div className="flex flex-col gap-4 jusit">
            <h3 className="font-semibold text-base border-b pb-2">Contrato e Pagamento</h3>
            <RadioField label="Tipo de Contrato" name="Contract" control={control}
              options={[{ label: "Mensal", value: "Month-to-month" }, { label: "1 Ano", value: "One year" }, { label: "2 Anos", value: "Two year" }]} />
            <RadioField label="Fatura Digital" name="PaperlessBilling" control={control} options={simNao} />
            <RadioField label="Método de Pagamento" name="PaymentMethod" control={control}
              options={[
                { label: "Cartão", value: "Credit card (automatic)" },
                { label: "Débito", value: "Bank transfer (automatic)" },
                { label: "Boleto", value: "Mailed check" },
                { label: "Cheque", value: "Electronic check" },
              ]} />

            <div className="flex flex-col gap-1">
              <Label>Mensalidade (R$)</Label>
              <Input type="number" step="0.01" placeholder="Ex: 79.90" {...register("MonthlyCharges")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Total Pago (R$)</Label>
              <Input type="number" step="0.01" placeholder="Ex: 1500.00" {...register("TotalCharges")} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Tempo como cliente (meses)</Label>
              <Input type="number" placeholder="Ex: 12" {...register("tenure")} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Analisando..." : "Prever Churn"}
          </Button>

          {/* RESULTADO */}
          {resultado && (
            <div className={`rounded-lg p-4 flex flex-col gap-2 ${resultado.risco === "Alto" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
              <h3 className="font-semibold text-base">Resultado</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Probabilidade de Churn:</span>
                <span className="font-bold">{(resultado.probabilidade_churn * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Risco:</span>
                <Badge variant={resultado.risco === "Alto" ? "destructive" : "default"}>
                  {resultado.risco}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Ação:</span>
                <span className="font-medium">{resultado.acao}</span>
              </div>
            </div>
          )}

        </form>
      </CardContent>
    </Card>
  )
}