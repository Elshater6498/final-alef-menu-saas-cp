import { UserInfo } from '@/@types/userInfo'
import { PasswordInput } from '@/components/shared'
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
import { apiCreateUser, apiUpdateUser } from '@/services/UserService'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-input-2'
import * as Yup from 'yup'
import 'react-phone-input-2/lib/style.css'
import { useAppSelector } from '@/store'

type Props = {
  dialogIsOpen: boolean
  onDialogeClose: () => void
  fetchClient: () => Promise<void>
  selectedRow: UserInfo
  setSelectedRow: () => void
}

type ClientForm = {
  email?: string
  name?: string
  phone?: string
  password?: string
  permissions?: ({
    label: string
    value: string
  } | undefined)[]
}

const UsersDialog = (props: Props) => {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const restaurant = useAppSelector((state) => state.restaurant.restaurant)
  let validationSchema;
  if (props.selectedRow.name) {
    validationSchema = Yup.object().shape({
      name: Yup.string().required(`${t('general.field-is-required')}`),
      phone: Yup.string().required(`${t('general.field-is-required')}`),
      permissions: Yup.array().required(`${t('general.field-is-required')}`),
    })
  } else {
    validationSchema = Yup.object().shape({
      name: Yup.string().required(`${t('general.field-is-required')}`),
      phone: Yup.string().required(`${t('general.field-is-required')}`),
      permissions: Yup.array().required(`${t('general.field-is-required')}`),
      email: Yup.string()
        .email(`${t('general.email-is-invalid')}`)
        .required(`${t('general.field-is-required')}`),
      password: Yup.string().required(`${t('general.field-is-required')}`),
    })
  }

  const initialValues = {
    email: "",
    name: "",
    phone: "",
    password: "",
    permissions: []
  }

  const handleFormSubmit = async (values: ClientForm) => {
    const formdata = new FormData()
    let permissions = [
    ]
    for (let i = 0; i < values.permissions!.length; i++) {
      const element = values.permissions![i]!.value;
      if (element == "categories") {
        permissions.push(...permissionsList.categories)
      }
      if (element == "products") {
        permissions.push(...permissionsList.products)
      }
      if (element == "orders") {
        permissions.push(...permissionsList.orders)
      }
      if (element == "rates") {
        permissions.push(...permissionsList.rates)
      }
      if (element == "restaurants") {
        permissions.push(...permissionsList.restaurants)
      }
    }
    if (props.selectedRow.name) {
      formdata.append('name', values.name!)
      formdata.append('phone', values.phone!)
      for (let index = 0; index < permissions.length; index++) {
        const element = permissions[index];
        formdata.append('permissions', element)
      }
    } else {
      formdata.append('name', values.name!)
      formdata.append('phone', values.phone!)
      formdata.append('email', values.email!)
      formdata.append('password', values.password!)
      formdata.append('restaurantId', restaurant.id!)
      for (let index = 0; index < permissions.length; index++) {
        const element = permissions[index];
        formdata.append('permissions', element)
      }
      formdata.append('paid', "true")
      formdata.append('active', "true")
      formdata.append('role', '4')
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
    "categories": [
      "categories.list",
      "categories.read",
      "categories.create",
      "categories.update",
      "categories.delete"
    ],
    "products": [
      "products.list",
      "products.read",
      "products.create",
      "products.update",
      "products.delete"
    ],
    "orders": [
      "orders.list",
      "orders.update"
    ],
    "restaurants": [
      "restaurants.read",
      "restaurants.update"
    ],
    "rates": [
      "rates.list",
      "rates.read",
      "rates.delete"
    ]
  }

  const options = [
    {
      label: `${t('nav.categories')}`,
      value: "categories"
    },
    {
      label: `${t('nav.products')}`,
      value: "products"
    },
    {
      label: `${t('nav.orders')}`,
      value: "orders"
    },
    {
      label: `${t('nav.rateing')}`,
      value: "rates"
    },
    {
      label: `${t('nav.client-home')}`,
      value: "restaurants"
    },
  ]

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
        {t('admin-management.user')}
      </h5>
      <Formik
        initialValues={props.selectedRow.name ? {
          ...props.selectedRow, permissions: [...options.map((item) => {
            if (props.selectedRow.permissions?.includes('categories.list') && item.value == "categories" ) {
              return item
            }
            if (props.selectedRow.permissions?.includes('products.list') && item.value == "products") {
              return item
            }
            if (props.selectedRow.permissions?.includes('orders.list') && item.value == "orders") {
              return item
            }
            if (props.selectedRow.permissions?.includes('rates.list') && item.value == "rates") {
              return item
            }
            if (props.selectedRow.permissions?.includes('restaurants.list') && item.value == "restaurants") {
              return item
            }
            else return
          })], password: ""
        } : initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer className="flex flex-col items-center">
                <div className='w-full h-96 overflow-y-auto px-4'>
                  <FormItem
                    className="w-full"
                    label={`${t('admin-management.user-name')}`}
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
                      placeholder={`${t('admin-management.user-name')}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    className="w-full"
                    label={`${t('admin-management.user-email')}`}
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
                      placeholder={`${t('admin-management.user-email')}`}
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    className="w-full"
                    label={`${t('admin-management.user-phone')}`}
                    invalid={!!(errors.phone && touched.phone)}
                    errorMessage={
                      typeof errors.phone === 'string'
                        ? errors.phone
                        : undefined
                    }
                    asterisk
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
                    label={`${t('admin-management.permissions')}`}
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
                          options={options}
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

export default UsersDialog
