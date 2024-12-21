import { PlanType } from '@/@types/plan'
import {
  Button,
  Dialog,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Select,
  toast,
} from '@/components/ui'
import { currencyList } from '@/constants/countries.constant'
import { apiCreatePlan, apiUpdatePlan } from '@/services/PlanService'
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, getIn } from 'formik'
import { useEffect, useState } from 'react'
import CurrencyFlagImage from 'react-currency-flags'
import { useTranslation } from 'react-i18next'
import { HiCheck, HiMinus } from 'react-icons/hi'
import { components } from 'react-select'

import * as Yup from 'yup'

type Props = {
  dialogIsOpen: boolean
  onDialogeClose: () => void
  fetchClient: () => Promise<void>
  selectedRow: PlanType
  setSelectedRow: () => void
}
const { MultiValueLabel, Control } = components
type PackagesDialogForm = {
  name?: string
  enName?: string
  price?: number
  currency?: string
  details?: string
  enDetails?: string
  duration?: number
  features?: string[]
  enFeatures?: string[]
  frontPermissions?: string[]
}

const PackagesDialog = (props: Props) => {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [addons, setAddons] = useState<
    {
      label: string
      value: string
    }[]
  >([
    {
      label: "",
      value: ""
    }
  ])
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(`${t('general.field-is-required')}`),
    enName: Yup.string().required(`${t('general.field-is-required')}`),
    price: Yup.number().required(`${t('general.field-is-required')}`),
    currency: Yup.string().required(`${t('general.field-is-required')}`),
    details: Yup.string().required(`${t('general.field-is-required')}`),
    enDetails: Yup.string().required(`${t('general.field-is-required')}`),
    duration: Yup.number().required(`${t('general.field-is-required')}`),
    features: Yup.array().of(Yup.string()).required(`${t('general.field-is-required')}`),
    enFeatures: Yup.array().of(Yup.string()).required(`${t('general.field-is-required')}`),
    frontPermissions: Yup.array().required(`${t('general.field-is-required')}`),
  })

  const initialValues = {
    name: '',
    enName: '',
    price: 0,
    currency: '',
    details: '',
    enDetails: '',
    duration: 0,
    features: [],
    enFeatures: [],
    frontPermissions: [],
  }

  const fieldFeedback = (form: FormikProps<PackagesDialogForm>, name: string) => {
    const error = getIn(form.errors, name)
    const touch = getIn(form.touched, name)
    return {
      errorMessage: error || '',
      invalid: typeof touch === 'undefined' ? false : error && touch,
    }
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
        className={`flex items-center justify-between p-2 ${isSelected
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

  const options = [
    ...currencyList.map((item) => ({
      label: `${i18n.language == 'ar' ? item.native : item.name
        } - ${item.currency} - ${item.currency_symbol}`,
      value: item.iso3,
      flag: item.currency,
    })),
  ]

  const handleFormSubmit = async (values: PackagesDialogForm) => {
    const formData = new FormData()
    console.log(values.frontPermissions?.map((item : any)=> item.value));
    
    const x = currencyList.filter(
      (option) => option.iso3 === values.currency
    )
    formData.append(
      'name',
      `{"ar":"${values.name}" ,"en":"${values.enName}"}`
    )
    formData.append('price', values.price!.toString())
    formData.append('active', "true")
    formData.append('duration', values.duration!.toString())
    for (let index = 0; index < values.frontPermissions!.length; index++) {
      formData.append('frontPermissions', values.frontPermissions![index].value)
    }
    formData.append(
      'details',
      `{"ar":"${values.details ?? ''}" ,"en":"${values.enDetails ?? ''}"}`
    )
    formData.append(
      'features',
      JSON.stringify({ar:values.features ,en:values.enFeatures})
    )
    formData.append(
      'currency',
      `{"name":"${x[0].currency_symbol}" ,"enName":"${x[0].currency}" ,"iso3":"${values.currency}"}`
    )
    try {
      if (props.selectedRow.id) {
        const response = await apiUpdatePlan(
          formData,
          props.selectedRow.id!
        )
        if (response.status === 200) {
          await props.fetchClient()
          props.onDialogeClose()
          props.setSelectedRow()
          toast.push(
            <Notification
              title={`${t('general.ok')}`}
              type="success"
            >
              {t('edit-success')}.
            </Notification>
          )
        }
      } else {
        const response = await apiCreatePlan(formData)
        if (response.status === 201) {
          await props.fetchClient()
          props.onDialogeClose()
          props.setSelectedRow()
          toast.push(
            <Notification
              title={`${t('general.ok')}`}
              type="success"
            >
              {t('general.create-success')}.
            </Notification>
          )
        }
      }
    } catch (error) {
      console.error(error)
      toast.push(
        <Notification title={`${t('general.error')}`} type="danger">
          {t('general.error-message')}.
        </Notification>
      )
    }
  }

  useEffect(() => {
    setAddons([
      {
        label: `${t('nav.rateing')}`,
        value: 'rates',
      },
      {
        label: `${t('nav.orders')}`,
        value: 'orders',
      }
    ]
    )
  }, [])

  return (
    <Dialog
      width={800}
      isOpen={props.dialogIsOpen}
      onClose={() => {
        props.onDialogeClose()
      }}
      onAfterClose={() => {
        props.setSelectedRow()
      }}
    >
      <h5 className="mb-4">
        {props.selectedRow.name ? t('general.edit') : t('general.add')}{' '}
        {t('package-management.package')}
      </h5>
      <Formik
        initialValues={props.selectedRow.name ? {
          name: JSON.parse(props.selectedRow.name!)?.ar as string,
          enName: JSON.parse(props.selectedRow.name!)?.ar as string,
          price: props.selectedRow.price,
          currency: props.selectedRow.currency?.iso3,
          details: JSON.parse(props.selectedRow.details!)?.ar as string,
          enDetails: JSON.parse(props.selectedRow.details!)?.en as string,
          duration: props.selectedRow.duration,
          features: props.selectedRow.features?.ar,
          enFeatures: props.selectedRow.features?.en,
          frontPermissions: [...addons.map((item)=> {
            if(props.selectedRow.frontPermissions?.includes(item.value)){
              return item
            }
            else return
          })],
        } : initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ values, touched, errors, isSubmitting }) => {
          const features = values.features
          const enFeatures = values.enFeatures
          return (
            <Form>
              <FormContainer className="">
                <div className="w-full h-[400px] overflow-auto px-1 ">
                  <FormItem
                    label={`${t('package-management.package-name-ar')}`}
                    htmlFor="name"
                    invalid={
                      !!(errors.name && touched.name)
                    }
                    errorMessage={
                      typeof errors.name === 'string'
                        ? errors.name
                        : undefined
                    }
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder={`${t(
                        'package-management.package-name-ar'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    htmlFor="enName"
                    label={`${t(
                      'package-management.package-name-en'
                    )}`}
                    invalid={
                      !!(errors.enName && touched.enName)
                    }
                    errorMessage={
                      typeof errors.enName === 'string'
                        ? errors.enName
                        : undefined
                    }
                  >
                    <Field
                      dir="ltr"
                      type="text"
                      autoComplete="off"
                      name="enName"
                      id="enName"
                      placeholder={`${t(
                        'package-management.package-name-en'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    htmlFor="details"
                    label={`${t(
                      'package-management.package-details'
                    )}`}
                    invalid={
                      !!(
                        errors.details &&
                        touched.details
                      )
                    }
                    errorMessage={
                      typeof errors.details === 'string'
                        ? errors.details
                        : undefined
                    }
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="details"
                      id="details"
                      textArea
                      placeholder={`${t(
                        'package-management.package-details'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    htmlFor="enDetails"
                    label={`${t(
                      'package-management.package-details-en'
                    )}`}
                    invalid={
                      !!(
                        errors.enDetails &&
                        touched.enDetails
                      )
                    }
                    errorMessage={
                      typeof errors.enDetails === 'string'
                        ? errors.enDetails
                        : undefined
                    }
                  >
                    <Field
                      dir="ltr"
                      type="text"
                      autoComplete="off"
                      name="enDetails"
                      id="enDetails"
                      textArea
                      placeholder={`${t(
                        'package-management.package-details-en'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    htmlFor="duration"
                    label={`${t('package-management.Package duration')}  (${t('package-management.month')})`}
                    invalid={errors.duration && touched.duration}
                    errorMessage={errors.duration}
                  >
                    <Field
                      type="number"
                      autoComplete="off"
                      name="duration"
                      id="duration"
                      component={Input}
                      inputMode="numeric"
                    />
                  </FormItem>
                  <FormItem
                    htmlFor="price"
                    label={`${t('package-management.package-price')}`}
                    invalid={errors.price && touched.price}
                    errorMessage={errors.price}
                  >
                    <Field
                      type="number"
                      autoComplete="off"
                      name="price"
                      id="price"
                      placeholder={`${t(
                        'package-management.package-price'
                      )}`}
                      component={Input}
                      inputMode="numeric"
                    />
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
                          onChange={(option) => {
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
                  <FormItem
                    className="w-full"
                    label={`${t(
                      'package-management.addons'
                    )}`}
                    invalid={
                      !!(errors.frontPermissions &&
                        touched.frontPermissions)
                    }
                    errorMessage={errors.frontPermissions as string}
                  >
                    <Field name="frontPermissions">
                      {({ field, form }: FieldProps) => (
                        <Select
                          isMulti
                          field={field}
                          form={form}
                          options={addons}
                          value={field.value}
                          onChange={(option) => {
                            form.setFieldValue(
                              field.name,
                              option
                            )
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <div className="w-full flex gap-4">
                    <FormItem
                      className="w-full flex items-start gap-4"
                      label={`${t('package-management.package-features')}`}
                      invalid={
                        !!(errors.features &&
                          touched.features)
                      }
                      errorMessage={errors.features?.toString()}
                    >
                      <FieldArray name="features">
                        {({
                          form,
                          remove,
                          push,
                        }) => (
                          <div className="!w-full flex flex-col gap-4">
                            {features &&
                              features.length > 0
                              ? features.map(
                                (
                                  _,
                                  index
                                ) => {
                                  const nameFeedBack =
                                    fieldFeedback(
                                      form,
                                      `features[${index}]`
                                    )
                                  return (
                                    <div
                                      key={
                                        index
                                      }
                                      className="!w-full flex items-center gap-4"
                                    >
                                      <Field
                                        invalid={
                                          nameFeedBack.invalid
                                        }
                                        name={`features[${index}]`}
                                        type="text"
                                        component={
                                          Input
                                        }
                                        className="w-full"
                                      />
                                      <Button
                                        shape="circle"
                                        size="sm"
                                        icon={
                                          <HiMinus />
                                        }
                                        onClick={() =>
                                          remove(
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  )
                                }
                              )
                              : null}
                            <div>
                              <Button
                                type="button"
                                className="ltr:mr-2 rtl:ml-2"
                                onClick={() => {
                                  push('')
                                }}
                              >
                                {t('package-management.add feature')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </FormItem>
                    <FormItem
                      className="w-full flex items-start gap-4"
                      label={`${t('package-management.package-features-en')}`}
                      invalid={
                        !!(errors.enFeatures &&
                          touched.enFeatures)
                      }
                      errorMessage={errors.enFeatures?.toString()}
                    >
                      <FieldArray name="enFeatures">
                        {({
                          form,
                          remove,
                          push,
                        }) => (
                          <div className="!w-full flex flex-col gap-4">
                            {enFeatures &&
                              enFeatures.length > 0
                              ? enFeatures.map(
                                (
                                  _,
                                  index
                                ) => {
                                  const nameFeedBack =
                                    fieldFeedback(
                                      form,
                                      `enFeatures[${index}]`
                                    )
                                  return (
                                    <div
                                      key={
                                        index
                                      }
                                      className="!w-full flex items-center gap-4"
                                    >
                                      <Field
                                        invalid={
                                          nameFeedBack.invalid
                                        }
                                        name={`enFeatures[${index}]`}
                                        type="text"
                                        component={
                                          Input
                                        }
                                        className="w-full"
                                      />
                                      <Button
                                        shape="circle"
                                        size="sm"
                                        icon={
                                          <HiMinus />
                                        }
                                        onClick={() =>
                                          remove(
                                            index
                                          )
                                        }
                                      />
                                    </div>
                                  )
                                }
                              )
                              : null}
                            <div>
                              <Button
                                type="button"
                                className="ltr:mr-2 rtl:ml-2"
                                onClick={() => {
                                  push('')
                                }}
                              >
                                {t('package-management.add feature')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </FormItem>
                  </div>
                </div>

                <div className="w-full flex gap-2 items-center text-right mt-6">
                  <Button
                    type="submit"
                    variant="solid"
                    loading={isSubmitting}
                  >
                    {props.selectedRow.id
                      ? t('general.edit')
                      : t('general.add')}
                  </Button>
                  <Button
                    type="button"
                    variant="plain"
                    disabled={isSubmitting}
                    onClick={props.onDialogeClose}
                  >
                    {t('general.cancel')}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}

export default PackagesDialog
