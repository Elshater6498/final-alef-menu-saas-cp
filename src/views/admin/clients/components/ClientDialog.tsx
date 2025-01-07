import { UserInfo } from '@/@types/userInfo'
import { PasswordInput } from '@/components/shared'
import SelectCountryCode from '@/components/shared/SelectCountryCode'
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
import { apiCreateUser, apiUpdateUser } from '@/services/UserService'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import CurrencyFlagImage from 'react-currency-flags'
import { useTranslation } from 'react-i18next'
import { HiCheck } from 'react-icons/hi'
import * as Yup from 'yup'
import { components } from 'react-select'
const { MultiValueLabel, Control } = components

import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2'

type Props = {
  dialogIsOpen: boolean
  onDialogeClose: () => void
  fetchClient: () => Promise<void>
  selectedRow: UserInfo
  setSelectedRow: () => void
}

type ClientForm = {
  email?: string
  password?: string
  name?: string
  phone?: string
  country?: string
  city?: string
  notes?: string
  responsiblePerson?: string
  price?: number
  duration?: number
  domain?: string
  currency?: string
  permissions?: ({
    label: string
    value: string
  } | undefined)[]
  // planId?: string
  // active: boolean
  // verified: boolean
  // paid: boolean
}

const ClientDialog = (props: Props) => {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [addons, setAddons] = useState<
    {
      label: string
      value: string
    }[]
  >([
    {
      label: `${t('nav.rateing')}`,
      value: 'rates',
    },
    {
      label: `${t('nav.orders')}`,
      value: 'orders',
    }
  ])
  const [defaultPermissions, setDefaultPermissions] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  let validationSchema;
  if (props.selectedRow.name) {
    validationSchema = Yup.object().shape({
      name: Yup.string().required(`${t('general.field-is-required')}`),
      phone: Yup.string().required(`${t('general.field-is-required')}`),
      country: Yup.string().required(`${t('general.field-is-required')}`),
      city: Yup.string().required(`${t('general.field-is-required')}`),
      notes: Yup.string(),
      responsiblePerson: Yup.string().required(`${t('general.field-is-required')}`),
      price: Yup.number().required(`${t('general.field-is-required')}`),
      duration: Yup.number().required(`${t('general.field-is-required')}`),
      domain: Yup.string().required(`${t('general.field-is-required')}`),
      currency: Yup.string().required(`${t('general.field-is-required')}`),
      permissions: Yup.array().required(`${t('general.field-is-required')}`),
    })
  } else {
    validationSchema = Yup.object().shape({
      email: Yup.string()
        .email(`${t('general.email-is-invalid')}`)
        .required(`${t('general.field-is-required')}`),
      password: Yup.string().required(`${t('general.field-is-required')}`),
      name: Yup.string().required(`${t('general.field-is-required')}`),
      phone: Yup.string().required(`${t('general.field-is-required')}`),
      country: Yup.string().required(`${t('general.field-is-required')}`),
      city: Yup.string().required(`${t('general.field-is-required')}`),
      notes: Yup.string(),
      responsiblePerson: Yup.string().required(`${t('general.field-is-required')}`),
      price: Yup.number().required(`${t('general.field-is-required')}`),
      duration: Yup.number().required(`${t('general.field-is-required')}`),
      domain: Yup.string().required(`${t('general.field-is-required')}`),
      currency: Yup.string().required(`${t('general.field-is-required')}`),
      permissions: Yup.array().nullable(),
    })
  }

  const initialValues = {
    email: "",
    name: "",
    phone: '',
    password: "",
    domain: "",
    price: 0,
    currency: '',
    responsiblePerson: '',
    city: '',
    notes: '',
    country: '',
    duration: 0,
    permissions: []
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

  const handleFormSubmit = async (values: ClientForm) => {
    const formdata = new FormData()
    const x = currencyList.filter(
      (option) => option.iso3 === values.currency
    )
    console.log(values.permissions!);
    
    let permissions = []
    for (let i = 0; i < values.permissions!.length; i++) {
      const element = values.permissions![i]!.value;
      if (element == "rates") {
        permissions.push(...permissionsList.rates)
      }
      if (element == "orders") {
        permissions.push(...permissionsList.orders)
      }
    }
    if (props.selectedRow.name) {
      formdata.append('name', values.name!)
      formdata.append('phone', values.phone!)
      formdata.append('name', values.name!)
      formdata.append('phone', values.phone!)
      formdata.append('country', values.country!)
      formdata.append('city', values.city!)
      formdata.append('notes', values.notes!)
      formdata.append('responsiblePerson', values.responsiblePerson!)
      formdata.append('domain', values.domain!)
      formdata.append('planPrice', values.price!.toString())
      formdata.append(
        'currency',
        `{"name":"${x[0].currency_symbol}" ,"enName":"${x[0].currency}" ,"iso3":"${values.currency}"}`
      )
      formdata.append('duration', values.duration!.toString())
      for (let index = 0; index < permissions.length; index++) {
        const element = permissions[index];
        formdata.append('permissions', element)
      }
    } else {
      formdata.append('email', values.email!)
      formdata.append('password', values.password!)
      formdata.append('name', values.name!)
      formdata.append('phone', values.phone!)
      formdata.append('country', values.country!)
      formdata.append('city', values.city!)
      formdata.append('notes', values.notes!)
      formdata.append('responsiblePerson', values.responsiblePerson!)
      formdata.append('domain', values.domain!)
      formdata.append('planPrice', values.price!.toString())
      formdata.append(
        'currency',
        `{"name":"${x[0].currency_symbol}" ,"enName":"${x[0].currency}" ,"iso3":"${values.currency}"}`
      )
      formdata.append('duration', values.duration!.toString())
      for (let index = 0; index < permissions.length; index++) {
        const element = permissions[index];
        formdata.append('permissions', element)
      }
      formdata.append('paid', "true")
      formdata.append('active', "true")
      formdata.append('role', '3')
    }
    try {
      if (props.selectedRow.id) {
        const response = await apiUpdateUser(
          formdata,
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
        const response = await apiCreateUser(formdata)
        if (response.status === 200) {
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

  const permissionsList = {
    "rates": [
      "rates.list",
      "rates.read",
      "rates.delete"
    ],
    "orders": [
      "orders.list",
      "orders.update"
    ],
  }

  useEffect(() => {
   const  permissions = []
    if(props.selectedRow.name){
      for (let index = 0; index < addons.length; index++) {
        const element = addons[index];
        console.log(addons[index]);
        
        console.log(props.selectedRow.permissions?.includes('orders.list') && element.value == "orders");
        console.log(props.selectedRow.permissions?.includes('rates.list') && element.value == "rates");
        
        if (props.selectedRow.permissions?.includes('orders.list') && element.value == "orders") {
          permissions.push(element)
        }
        if (props.selectedRow.permissions?.includes('rates.list') && element.value == "rates") {
          permissions.push(element)
        }
      }
      setDefaultPermissions(permissions)
    }

  }, [props.selectedRow])

  return (
    <Dialog
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
        {t('client-management.client')}
      </h5>
      <Formik
        initialValues={props.selectedRow.name ? {
          ...props.selectedRow, password: "", currency: props.selectedRow.currency?.iso3, price: props.selectedRow.planPrice, permissions: defaultPermissions,
        } : initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer className="flex flex-col items-center ">
                <div className='w-full h-96 overflow-y-auto px-4'>
                  <FormItem
                    className="w-full"
                    label={`${t(
                      'client-management.client-name'
                    )}`}
                    invalid={!!(errors.name && touched.name)}
                    errorMessage={
                      typeof errors.name === 'string'
                        ? errors.name
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="name"
                      placeholder={`${t(
                        'client-management.client-name'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    className="w-full"
                    label={`${t(
                      'client-management.client-email'
                    )}`}
                    invalid={!!(errors.email && touched.email)}
                    errorMessage={
                      typeof errors.email === 'string'
                        ? errors.email
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      disabled={!!props.selectedRow.name}
                      type="email"
                      autoComplete="off"
                      name="email"
                      placeholder={`${t(
                        'client-management.client-email'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    className="w-full"
                    asterisk
                    label={`${t(
                      'client-management.client-phone'
                    )}`}
                    invalid={!!(errors.phone && touched.phone)}
                    errorMessage={
                      typeof errors.phone === 'string'
                        ? errors.phone
                        : undefined
                    }
                  >
                    <Field name="phone">
                      {({ field, form }: FieldProps) => (
                        <div dir={'ltr'}>
                          <PhoneInput
                            inputClass="!w-full md:flex-1 !h-11 !px-14 "
                            buttonClass='!w-11'
                            country={'sa'}
                            value={field.value}
                            onChange={(phone) => {
                              form.setFieldValue(field.name, phone)
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    className="w-full"
                    label={`${t(
                      'client-management.client-country'
                    )}`}
                    invalid={!!(errors.country && touched.country)}
                    errorMessage={
                      typeof errors.country === 'string'
                        ? errors.country
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="country"
                      placeholder={`${t(
                        'client-management.client-country'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    className="w-full"
                    label={`${t(
                      'client-management.client-city'
                    )}`}
                    invalid={!!(errors.city && touched.city)}
                    errorMessage={
                      typeof errors.city === 'string'
                        ? errors.city
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="city"
                      placeholder={`${t(
                        'client-management.client-city'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    className="w-full"
                    label={`${t(
                      'client-management.client-responsiblePerson'
                    )}`}
                    invalid={!!(errors.responsiblePerson && touched.responsiblePerson)}
                    errorMessage={
                      typeof errors.responsiblePerson === 'string'
                        ? errors.responsiblePerson
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="responsiblePerson"
                      placeholder={`${t(
                        'client-management.client-responsiblePerson'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  {!!!props.selectedRow.name && <FormItem
                    className="w-full"
                    label={`${t('client-management.domain')}`}
                    invalid={
                      !!(errors.domain && touched.domain)
                    }
                    errorMessage={
                      typeof errors.domain === 'string'
                        ? errors.domain
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="domain"
                      placeholder={`xxxxx => https://alef-menu.com/xxxxx`}
                      component={Input}
                    />
                  </FormItem>}
                  <FormItem
                    htmlFor="duration"
                    label={`${t('package-management.Package duration')}  (${t('package-management.month')})`}
                    invalid={errors.duration && touched.duration}
                    errorMessage={errors.duration}
                    asterisk
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
                    asterisk
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
                    asterisk
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
                      !!(errors.permissions &&
                        touched.permissions)
                    }
                    errorMessage={errors.permissions as string}
                    asterisk
                  >
                    <Field name="permissions">
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
                  <FormItem
                    htmlFor="details"
                    label={`${t(
                      'client-management.client-notes'
                    )}`}
                    invalid={
                      !!(
                        errors.notes &&
                        touched.notes
                      )
                    }
                    errorMessage={
                      typeof errors.notes === 'string'
                        ? errors.notes
                        : undefined
                    }
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="notes"
                      id="notes"
                      textArea
                      placeholder={`${t(
                        'client-management.client-notes'
                      )}`}
                      component={Input}
                    />
                  </FormItem>
                  {!!!props.selectedRow.name && <FormItem
                    className="w-full"
                    label={`${t('client-management.password')}`}
                    invalid={
                      !!(errors.password && touched.password)
                    }
                    errorMessage={
                      typeof errors.password === 'string'
                        ? errors.password
                        : undefined
                    }
                    asterisk
                  >
                    <Field
                      autoComplete="off"
                      name="password"
                      placeholder={`${t(
                        'client-management.password'
                      )}`}
                      component={PasswordInput}
                    />
                  </FormItem>}
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

export default ClientDialog
