import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import useRestaurant from '@/utils/hooks/useRestaurant'
import {
    Field,
    FieldArray,
    FieldProps,
    Form,
    Formik,
    FormikProps,
    getIn,
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

type daysFormType = {
    days: {
        openedFrom?: string
        openedTo?: string
        off?: boolean
    }[],
    showDates?: boolean
}

const WorkingHours = () => {
    const { t } = useTranslation()
    const { updateRestaurant } = useRestaurant()
    const date = useAppSelector((state) => state.restaurant.restaurant.date)
    const showDates = useAppSelector((state) => state.restaurant.restaurant.showDates)
    const validationSchema = Yup.object().shape({
        days: Yup.array().of(
            Yup.object().shape({
                openedFrom: Yup.string(),
                openedTo: Yup.string(),
                off: Yup.bool(),
            })
        ),
        ShowDates: Yup.bool(),
    })

    // handel submit
    const handleSubmit = async (values: daysFormType) => {
        const formData = new FormData()
        formData.append(
            'date',
            JSON.stringify([
                ...values.days.map((item, i) => ({ ...item, day: i })),
            ])
        )
        formData.append(
            'showDates',
            `${values.showDates}`
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

    const fieldFeedback = (form: FormikProps<daysFormType>, name: string) => {
        const error = getIn(form.errors, name)
        const touch = getIn(form.touched, name)
        return {
            errorMessage: error || '',
            invalid: typeof touch === 'undefined' ? false : error && touch,
        }
    }

    return (
        <Formik
            initialValues={{
                days: date && date.length > 0 ?  date : [
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                    {
                        openedFrom: '00:00',
                        openedTo: '23:59',
                        off: true,
                    },
                ],
              showDates: showDates ?? false
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isSubmitting  ,touched, errors,}) => {
                const days = values.days
                return (
                    <Form>
                        <FormContainer size="sm">
                            <div className="max-w-3xl mx-auto ">
                                <FieldArray name="days">
                                    {({ form, remove, push }) => (
                                        <div className='divide-y'>
                                            {days && days.length > 0
                                                ? days.map((_, index) => {
                                                    const openedFrom =
                                                        fieldFeedback(
                                                            form,
                                                            `days[${index}].openedFrom`
                                                        )
                                                    const openedTo =
                                                        fieldFeedback(
                                                            form,
                                                            `days[${index}].openedTo`
                                                        )
                                                    const off = fieldFeedback(
                                                        form,
                                                        `days[${index}].off`
                                                    )
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="w-full flex flex-col  md:flex-row  gap-4 items-center justify-center pt-2"
                                                        >
                                                            <div className="flex gap-5 items-center justify-center">
                                                                <p className="w-20">
                                                                    {index ===
                                                                        0 &&
                                                                        t(
                                                                            `client-home.Working-hours.Sunday`
                                                                        )}
                                                                    {index ===
                                                                        1 &&
                                                                        t(
                                                                            `client-home.Working-hours.Monday`
                                                                        )}
                                                                    {index ===
                                                                        2 &&
                                                                        t(
                                                                            `client-home.Working-hours.Tuesday`
                                                                        )}
                                                                    {index ===
                                                                        3 &&
                                                                        t(
                                                                            `client-home.Working-hours.Wednesday`
                                                                        )}
                                                                    {index ===
                                                                        4 &&
                                                                        t(
                                                                            `client-home.Working-hours.Thursday`
                                                                        )}
                                                                    {index ===
                                                                        5 &&
                                                                        t(
                                                                            `client-home.Working-hours.Friday`
                                                                        )}
                                                                    {index ===
                                                                        6 &&
                                                                        t(
                                                                            `client-home.Working-hours.Saturday`
                                                                        )}
                                                                </p>
                                                                <Tag
                                                                    className={`${values
                                                                            .days[
                                                                            index
                                                                        ].off
                                                                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 gap-2'
                                                                            : 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0 gap-2'
                                                                        }`}
                                                                >
                                                                    <Field
                                                                        name={`days[${index}].off`}
                                                                        id={`days[${index}].off`}
                                                                        invalid={
                                                                            off.invalid
                                                                        }
                                                                    >
                                                                        {({
                                                                            field,
                                                                            form,
                                                                            meta,
                                                                        }: FieldProps) => (
                                                                            <Switcher
                                                                                color="emerald-500"
                                                                                field={
                                                                                    field
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                    <span>
                                                                        {values
                                                                            .days[
                                                                            index
                                                                        ].off
                                                                            ? t(
                                                                                'client-home.Working-hours.opened'
                                                                            )
                                                                            : t(
                                                                                'client-home.Working-hours.closed'
                                                                            )}
                                                                    </span>
                                                                </Tag>
                                                            </div>
                                                            <div className="flex-1 flex gap-2">
                                                                <FormItem
                                                                    size="sm"
                                                                    className="flex-1"
                                                                    label={`${t(
                                                                        `client-home.Working-hours.from`
                                                                    )}`}
                                                                    htmlFor={`days[${index}].openedFrom`}
                                                                    invalid={
                                                                        openedFrom.invalid
                                                                    }
                                                                    errorMessage={
                                                                        openedFrom.errorMessage
                                                                    }
                                                                >
                                                                    <Field
                                                                        type={
                                                                            'time'
                                                                        }
                                                                        invalid={
                                                                            openedFrom.invalid
                                                                        }
                                                                        disabled={
                                                                            !values
                                                                                .days[
                                                                                index
                                                                            ]
                                                                                .off
                                                                        }
                                                                        name={`days[${index}].openedFrom`}
                                                                        id={`days[${index}].openedFrom`}
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>
                                                                <FormItem
                                                                    size="sm"
                                                                    className="flex-1"
                                                                    label={`${t(
                                                                        `client-home.Working-hours.to`
                                                                    )}`}
                                                                    htmlFor={`days[${index}].openedTo`}
                                                                    invalid={
                                                                        openedTo.invalid
                                                                    }
                                                                    errorMessage={
                                                                        openedTo.errorMessage
                                                                    }
                                                                >
                                                                    <Field
                                                                        type={
                                                                            'time'
                                                                        }
                                                                        invalid={
                                                                            openedTo.invalid
                                                                        }
                                                                        disabled={
                                                                            !values
                                                                                .days[
                                                                                index
                                                                            ]
                                                                                .off
                                                                        }
                                                                        name={`days[${index}].openedTo`}
                                                                        id={`days[${index}].openedTo`}
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                : null}
                                        </div>
                                    )}
                                </FieldArray>
                                <Card>
                                  <div className='flex gap-4'>
                                  <Field
                                      name={`showDates`}
                                      id={`showDates`}
                                      invalid = {
                                        errors.showDates &&
                                        touched.showDates  as boolean
                                    }
                                    errorMessage={errors.showDates}
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
                                  <span>{t('client-home.Working-hours.Show the status (closed or open) in the main menu')}</span>
                                  </div>
                                </Card>
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

export default WorkingHours
