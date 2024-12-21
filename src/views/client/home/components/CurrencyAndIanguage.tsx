import { Avatar, Button, FormContainer, FormItem, Notification, Select, toast } from '@/components/ui'
import { useAppSelector } from '@/store'
import useRestaurant from '@/utils/hooks/useRestaurant'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { components } from 'react-select'
import { HiCheck } from 'react-icons/hi'
import { currencyList } from '@/constants/countries.constant'
import CurrencyFlagImage, { CurrencyFlag } from 'react-currency-flags/dist/components'

const { MultiValueLabel, Control } = components

type Restourantformtype = {
    defaultLanguage: string
    currency: string
}

const CurrencyAndIanguage = () => {
    const { t  , i18n} = useTranslation()
    const { updateRestaurant } = useRestaurant()
    const restaurant = useAppSelector((state) => state.restaurant.restaurant)

    const validationSchema = Yup.object().shape({
        defaultLanguage: Yup.string().required(
            `${t('general.field-is-required')}`
        ),
        currency: Yup.string().required(`${t('general.field-is-required')}`),
    })

    const restaurantInitialValues = {
        defaultLanguage: restaurant.defaultLanguage!,
        currency: restaurant.currency?.iso3!,
    }

    // handel submit
    const handleSubmit = async (values: Restourantformtype) => {
        const formData = new FormData()
        const x = currencyList.filter(
            (option) => option.iso3 === values.currency
        )
        formData.append(
            'currency',
            `{"name":"${x[0].currency_symbol}" ,"enName":"${x[0].currency}" ,"iso3":"${values.currency}"}`
        )
        formData.append('defaultLanguage', values.defaultLanguage)
        const res = await updateRestaurant(formData)
        if (res?.status === 'success') {
            toast.push(
                <Notification title={`${t('general.success')}`} type="success">
                    {t('general.edit-success')}
                </Notification>
            )
        } else {
            toast.push(
                <Notification title={`${t('general.error')}`} type="danger">
                    {t('general.error-message')}
                </Notification>
            )
        }
    }
    // handel submit
    const options = [
        ...currencyList.map((item) => ({
            label: `${
                i18n.language == 'ar' ? item.native : item.name
            } - ${item.currency} - ${item.currency_symbol}`,
            value: item.iso3,
            flag: item.currency,
        })),
    ]
    
    const optionLang = [
        {
            label: 'English',
            value: 'en',
            flag: '/img/countries/us.png',
            dir: 'ltr',
        },
        {
            label: 'Arabic',
            value: 'ar',
            flag: '/img/countries/ar.png',
            dir: 'rtl',
        },
    ]

    const CustomControl = ({ children, ...props } : any) => {
        const selected = props.getValue()[0]
        return (
            <Control {...props}>
                {selected && (
                    <Avatar
                        className="ltr:ml-4 rtl:mr-4"
                        shape="circle"
                        size={18}
                        src={selected.flag}
                    />
                )}
                {children}
            </Control>
        )
    }

    const CustomSelectOption = ({ innerProps, label, data, isSelected } : any) => {
        return (
            <div
                className={`flex items-center justify-between p-2 ${
                    isSelected
                        ? 'bg-gray-100 dark:bg-gray-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                {...innerProps}
            >
                <div className="flex items-center">
                    <Avatar shape="circle" size={20} src={data.flag} />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </div>
                {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
            </div>
        )
    }

    const CustomControlcurrency = ({ children, ...props }: any) => {
        const selected = props.getValue()[0]
        return (
            <Control {...props}>
                {selected && (
                    <div className="ml-2 rtl:mr-2">
                        <CurrencyFlagImage currency={selected.flag} size="sm" />
                    </div>
                )}
                {children}
            </Control>
        )
    }

    const CustomSelectOptioncurrency = ({
        innerProps,
        label,
        data,
        isSelected,
    }: any) => {
        return (
            <div
                className={`flex items-center justify-between p-2 ${
                    isSelected
                        ? 'bg-gray-100 dark:bg-gray-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                {...innerProps}
            >
                <div className="flex items-center">
                    <CurrencyFlagImage currency={data.flag} size="sm" />
                    <span className="ml-2 rtl:mr-2">{label}</span>
                </div>
                {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
            </div>
        )
    }
    return (
        <Formik
            initialValues={
                restaurant
                    ? restaurantInitialValues
                    : {
                          defaultLanguage: '',
                          currency: '',
                      }
            }
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                return (
                    <Form>
                        <FormContainer>
                            <div className="max-w-4xl mx-auto">
                                
                                <FormItem
                                    label={`${t(
                                        'client-home.identity-customization.Choose the default language for display'
                                    )}`}
                                    invalid={
                                        errors.defaultLanguage &&
                                        touched.defaultLanguage
                                    }
                                    errorMessage={errors.defaultLanguage}
                                >
                                    <Field name="defaultLanguage">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={optionLang}
                                                components={{
                                                    Option: CustomSelectOption,
                                                    Control: CustomControl,
                                                }}
                                                value={optionLang.filter(
                                                    (option) =>
                                                        option.value ===
                                                        field.value
                                                )}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label={`${t(
                                        "client-home.identity-customization.Choose the country's currency"
                                    )}`}
                                    invalid={
                                        errors.currency && touched.currency
                                    }
                                    errorMessage={errors.currency}
                                >
                                    <Field name="currency">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={options}
                                                components={{
                                                    Option: CustomSelectOptioncurrency,
                                                    Control:
                                                        CustomControlcurrency,
                                                }}
                                                value={options.filter(
                                                    (option) =>
                                                        option.value ===
                                                        field.value
                                                )}
                                                onChange={(option) =>
                                                    {
                                                      form.setFieldValue(
                                                        field.name,
                                                        option?.value
                                                    )
                                                    }
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {t('client-home.Save data')}
                                    </Button>
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default CurrencyAndIanguage