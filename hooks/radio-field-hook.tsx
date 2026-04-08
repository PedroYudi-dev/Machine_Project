import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues } from "@/types/formClient";
import { Controller } from "react-hook-form";

export default function RadioField({
  label,
  name,
  options,
  control,
}: {
  label: string
  name: keyof FormValues
  options: { label: string; value: string }[]
  control: any
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="flex flex-wrap gap-4"
          >
            {options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
                <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
    </div>
  )
}