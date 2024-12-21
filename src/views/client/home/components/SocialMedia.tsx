import {
    Button,
    FormContainer,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { useAppSelector } from '@/store'
import useRestaurant from '@/utils/hooks/useRestaurant'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

type SocialMediaFormType = {
    facebook: string
    instagram: string
    snapchat: string
    tiktok: string
    x: string
    telegram: string
    googleRate: string
    googleMap: string
}

const SocialMedia = () => {
    const validationSchema = Yup.object().shape({
        facebook: Yup.string(),
        instagram: Yup.string(),
        snapchat: Yup.string(),
        tiktok: Yup.string(),
        x: Yup.string(),
        telegram: Yup.string(),
        googleRate: Yup.string(),
        googleMap: Yup.string(),
    })
    const { t } = useTranslation()
    const { updateRestaurant } = useRestaurant()
    const socialMedia = useAppSelector(
        (state) => state.restaurant.restaurant.socialMedia
    )

    // handel submit
    const handleSubmit = async (values: SocialMediaFormType) => {
        const formData = new FormData()
        formData.append(
            'socialMedia',
            JSON.stringify([ 
              {key: "facebook", value:values.facebook},
              {key: "instagram", value:values.instagram},
              {key: "snapchat", value:values.snapchat},
              {key: "tiktok", value:values.tiktok},
              {key: "x", value:values.x},
              {key: "telegram", value:values.telegram},
              {key: "google-rate", value:values.googleRate},
              {key: "google-map", value:values.googleMap}
              ])
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
            initialValues={
                socialMedia && socialMedia.length > 0
                    ? {
                          facebook: socialMedia![0]?.value || '',
                          instagram: socialMedia![1]?.value || '',
                          snapchat: socialMedia![2]?.value || '',
                          tiktok: socialMedia![3]?.value || '',
                          x: socialMedia![4]?.value || '',
                          telegram: socialMedia![5]?.value || '',
                          googleRate: socialMedia![6]?.value || '',
                          googleMap: socialMedia![7]?.value || '',
                      }
                    : {
                          facebook: '',
                          instagram: '',
                          snapchat: '',
                          tiktok: '',
                          x: '',
                          telegram: '',
                          googleRate: '',
                          googleMap: '',
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
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.facebook'
                                        )}`}
                                        htmlFor="facebook"
                                        invalid={
                                            errors.facebook && touched.facebook
                                        }
                                        errorMessage={errors.facebook}
                                    >
                                        <Field
                                            type="text"
                                            dir="ltr"
                                            autoComplete="off"
                                            name="facebook"
                                            id="facebook"
                                            placeholder="https://facebook.com"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.instagram'
                                        )}`}
                                        htmlFor="instagram"
                                        invalid={
                                            errors.instagram &&
                                            touched.instagram
                                        }
                                        errorMessage={errors.instagram}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="instagram"
                                            id="instagram"
                                            placeholder="https://instagram.com"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.snapchat'
                                        )}`}
                                        htmlFor="snapchat"
                                        invalid={
                                            errors.snapchat && touched.snapchat
                                        }
                                        errorMessage={errors.snapchat}
                                    >
                                        <Field
                                            type="text"
                                            dir="ltr"
                                            autoComplete="off"
                                            name="snapchat"
                                            id="snapchat"
                                            placeholder="https://www.snapchat.com/"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.tiktok'
                                        )}`}
                                        htmlFor="tiktok"
                                        invalid={
                                            errors.tiktok && touched.tiktok
                                        }
                                        errorMessage={errors.tiktok}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="tiktok"
                                            id="tiktok"
                                            placeholder="https://www.tiktok.com/"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.x'
                                        )}`}
                                        htmlFor="x"
                                        invalid={errors.x && touched.x}
                                        errorMessage={errors.x}
                                    >
                                        <Field
                                            type="text"
                                            dir="ltr"
                                            autoComplete="off"
                                            name="x"
                                            id="x"
                                            placeholder="https://twitter.com"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.telegram'
                                        )}`}
                                        htmlFor="telegram"
                                        invalid={
                                            errors.telegram && touched.telegram
                                        }
                                        errorMessage={errors.telegram}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="telegram"
                                            id="telegram"
                                            placeholder="https://web.telegram.org/"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.google Rate'
                                        )}`}
                                        htmlFor="googleRate"
                                        invalid={
                                            errors.googleRate &&
                                            touched.googleRate
                                        }
                                        errorMessage={errors.googleRate}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="googleRate"
                                            id="googleRate"
                                            placeholder="https://google.com"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.social-media-links.google Map'
                                        )}`}
                                        htmlFor="googleMap"
                                        invalid={
                                            errors.googleMap &&
                                            touched.googleMap
                                        }
                                        errorMessage={errors.googleMap}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="googleMap"
                                            id="googleMap"
                                            placeholder="https://www.google.com/maps"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
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

export default SocialMedia
