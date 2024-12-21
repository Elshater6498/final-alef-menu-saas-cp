import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import useRestaurant from '@/utils/hooks/useRestaurant'
import {
  Field,
  FieldProps,
  Form,
  Formik,
} from 'formik'
import {
  Button,
  Card,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Switcher,
  Tag,
  toast,
} from '@/components/ui'
import { useAppSelector } from '@/store'

type orderSettingFormType = {
  tables?: number
  shippingFees?: number
  takeaway?: boolean
  delivery?: boolean
  inRestaurant?: boolean
}

const OrderSetting = () => {
  const { t } = useTranslation()
  const { updateRestaurant } = useRestaurant()
  const restaurant = useAppSelector((state) => state.restaurant.restaurant)
  const validationSchema = Yup.object().shape({
    tables: Yup.number().required(`${t('general.field-is-required')}`),
    shippingFees: Yup.number().required(`${t('general.field-is-required')}`),
    takeaway: Yup.bool(),
    delivery: Yup.bool(),
    inRestaurant: Yup.bool(),
  })

  // handel submit
  const handleSubmit = async (values: orderSettingFormType) => {
    const formData = new FormData()
    formData.append('tables', `${values.tables}`)
    formData.append('shippingFees', `${values.shippingFees}`)
    formData.append(
      'takeaway',
      `${values.takeaway}`
    )
    formData.append(
      'delivery',
      `${values.delivery}`
    )
    formData.append(
      'inRestaurant',
      `${values.inRestaurant}`
    )
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
  return (
    <Formik
      initialValues={{
        tables: restaurant.tables ?? 0,
        shippingFees: restaurant.shippingFees ?? 0,
        takeaway: restaurant.takeaway ?? true,
        delivery: restaurant.delivery ?? true,
        inRestaurant: restaurant.inRestaurant ?? true,
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, touched, errors, }) => {
        return (
          <Form>
            <FormContainer size="sm">
              <div className="max-w-3xl mx-auto space-y-2">
                <Card>
                  <div className='flex gap-4'>
                    <Field
                      name={`takeaway`}
                      id={`takeaway`}
                      invalid={
                        errors.takeaway &&
                        touched.takeaway as boolean
                      }
                      errorMessage={errors.takeaway}
                    >
                      {({
                        field,
                        form,
                        meta,
                      }: FieldProps) => (
                        <Switcher
                          field={
                            field
                          }
                        />
                      )}
                    </Field>
                    <span>{t('client-home.takeaway')}</span>
                  </div>
                </Card>
                <Card>
                  <div className='flex gap-4'>
                    <Field
                      name={`delivery`}
                      id={`delivery`}
                      invalid={
                        errors.delivery &&
                        touched.delivery as boolean
                      }
                      errorMessage={errors.delivery}
                    >
                      {({
                        field,
                        form,
                        meta,
                      }: FieldProps) => (
                        <Switcher
                          field={
                            field
                          }
                        />
                      )}
                    </Field>
                    <span>{t('client-home.delivery')}</span>
                  </div>
                </Card>
                <Card>
                  <div className='flex gap-4'>
                    <Field
                      name={`inRestaurant`}
                      id={`inRestaurant`}
                      invalid={
                        errors.inRestaurant &&
                        touched.inRestaurant as boolean
                      }
                      errorMessage={errors.inRestaurant}
                    >
                      {({
                        field,
                        form,
                        meta,
                      }: FieldProps) => (
                        <Switcher
                          field={
                            field
                          }
                        />
                      )}
                    </Field>
                    <span>{t('client-home.inRestaurant')}</span>
                  </div>
                </Card>
                <FormItem
                  className="w-full md:flex-1"
                  label={`${t(
                    'client-home.identity-customization.Delivery price'
                  )}`}
                  htmlFor="shippingFees"
                  invalid={
                    errors.shippingFees && touched.shippingFees
                  }
                  errorMessage={errors.shippingFees}
                >
                  <Field
                    type="number"
                    autoComplete="off"
                    name="shippingFees"
                    id="shippingFees"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  className="w-full md:flex-1"
                  label={`${t(
                    'client-home.identity-customization.Number of tables'
                  )}`}
                  htmlFor="tables"
                  invalid={
                    errors.tables && touched.tables
                  }
                  errorMessage={errors.tables}
                >
                  <Field
                    type="number"
                    autoComplete="off"
                    name="tables"
                    id="tables"
                    // placeholder="عدد الطاولات ..."
                    component={Input}
                  />
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

export default OrderSetting