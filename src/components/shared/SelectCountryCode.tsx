import { FieldProps } from "formik"
import { Select } from "../ui"
import { countryCodeList } from "@/assets/CountryCode"
import { useEffect, useState } from "react"

const SelectCountryCode = (props: FieldProps) => {
    const [defaultValue, setdefaultValue] = useState<{
        value?: string
        label?: string
    }>({
    })
    const options = [
        ...countryCodeList.map((item) => {
            return {
                value: `+${item.code}`,
                label: `${item.iso} (+${item.code})`,
            }
        }),
    ]

    useEffect(() => {
        if(props.field.value != ''){
            const index = options.findIndex(
                (item) => item.value === props.field.value
            )
            setdefaultValue(options[index])
        }else {
            setdefaultValue(options[187])
        }
    }, [props.field.value])

    return (
        <Select
            // {...props}
            onChange={(option) =>
                props.form.setFieldValue(props.field.name, option?.value)
            }
            options={options}
            value={defaultValue}
        />
    )
}

export default SelectCountryCode