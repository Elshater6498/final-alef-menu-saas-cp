import { RichTextEditor } from '@/components/shared'
import { Avatar, Button, FormContainer, FormItem, Notification, toast, Upload } from '@/components/ui'
import appConfig from '@/configs/app.config'
import { useAppSelector } from '@/store'
import useRestaurant from '@/utils/hooks/useRestaurant'
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlinePlus } from 'react-icons/hi'
import * as Yup from 'yup'

type Restourantformtype = {
  details: string
  enDetails: string
  cover: string
}

const AboutUs = () => {
  const { t } = useTranslation()
  const { updateRestaurant } = useRestaurant()
  const restaurant = useAppSelector((state) => state.restaurant.restaurant)

  const validationSchema = Yup.object().shape({
    cover: Yup.mixed().nullable(),
    details: Yup.string().required(`${t('general.field-is-required')}`),
    enDetails: Yup.string().required(`${t('general.field-is-required')}`),
  })

  const [cover, setcover] = useState<string | null>(null)

  // handel image
  const onFileUploadcover = async (
    files: File[],
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<{

    }>>
  ) => {
    if (files.length > 0) {
      setcover(URL.createObjectURL(files[0]))
      setFieldValue('cover', files[0])
    }
  }
  const beforeUploadcover = (files: FileList | null) => {
    let valid: string | boolean = true
    const allowedFileType = ['image/jpeg', 'image/png']
    if (files) {
      for (const file of files) {
        if (!allowedFileType.includes(file.type)) {
          valid = 'Please upload a .jpeg or .png file!'
        }
      }
    }
    return valid
  }
  // handel image

  // handel submit
  const handleSubmit = async (values: Restourantformtype) => {
    const formData = new FormData()
    formData.append(
      'details',
      `{"ar":"${values.details}" ,"en":"${values.enDetails}"}`
    )
    if (values.cover && typeof values.cover != 'string') {
      formData.append('detailsImage', values.cover!)
    }
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

  const restaurantInitialValues = {
    details: JSON.parse(restaurant.details!)?.ar as string || '',
    enDetails: JSON.parse(restaurant.details!)?.en as string || '',
    cover: restaurant.cover!,
  }

  const RichText = (props: FieldProps) => {
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        // ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        // [{ font: [] }],
        [{ align: [] }],

        ['clean'],
      ],
    }
    const formats = [
      'header',
      'font',
      'size',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'link',
      'image',
      'video',
      'align',
    ]
    return (
      <div dir="ltr">
        <RichTextEditor
          modules={modules}
          formats={formats}
          value={props.field.value}
          onChange={(value) => {
            props.form.setFieldValue(props.field.name, value)
          }}
        />
      </div>
    )
  }

  useEffect(() => {
    if (restaurant.detailsImage) {
      setcover(appConfig.apiPrefix + restaurant.detailsImage!)
    }
  }, [restaurant])

  return (
    <Formik
      initialValues={
        restaurant
          ? restaurantInitialValues
          : {
            cover: '',
            details: '',
            enDetails: ''
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
                  className="w-full"
                  label={`${t(
                    'client-home.identity-customization.Image About us'
                  )}`}
                  invalid={errors.details && touched.details}
                  errorMessage={errors.details}
                >
                  <Field
                    name="cover"
                    placeholder="اختر صورة مناسبة"
                    className="w-full"
                  >
                    {({ field, form, meta }: FieldProps) => (
                      <>
                        <Upload
                          className="cursor-pointer w-full h-full"
                          beforeUpload={
                            beforeUploadcover
                          }
                          onChange={(file) => {
                            onFileUploadcover(
                              file,
                              setFieldValue
                            )
                          }}
                          showList={false}
                          uploadLimit={1}
                        >
                          <Avatar
                            className="w-full h-[300px]"
                            src={cover!}
                            icon={
                              <HiOutlinePlus className="" />
                            }
                          />
                        </Upload>
                        {meta.touched && meta.error && (
                          <div className="error">
                            {meta.error}
                          </div>
                        )}
                      </>
                    )}
                  </Field>
                </FormItem>

                <FormItem
                  className="w-full"
                  label={`${t(
                    'client-home.identity-customization.AboutUs-arabic'
                  )}`}
                  invalid={errors.details && touched.details}
                  errorMessage={errors.details}
                >
                  <Field
                    dir="rtl"
                    type="text"
                    autoComplete="off"
                    name="details"
                    component={RichText}
                  />
                </FormItem>
                <FormItem
                  className="w-full"
                  label={`${t(
                    'client-home.identity-customization.AboutUs-english'
                  )}`}
                  invalid={
                    errors.enDetails && touched.enDetails
                  }
                  errorMessage={errors.enDetails}
                >
                  <Field
                    dir="ltr"
                    type="text"
                    autoComplete="off"
                    name="enDetails"
                    component={RichText}
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

export default AboutUs