import Title from '@/components/shared/Title'
import { useTranslation } from 'react-i18next'
import { Category } from '@/@types/category'
import { Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useEffect, useState } from 'react'
import { IoFastFoodOutline } from 'react-icons/io5'
import ProductTabel from './components/ProductTabel'
import { Product } from '@/@types/Product'
import { apiGetProduct } from '@/services/ProductService'
import { apiGetCategory } from '@/services/CategoryService'
import { useAppSelector } from '@/store'

const Products = () => {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [categoryList, setCategoryList] = useState<Category[]>(() => [])
  const [productList, setProductList] = useState<Product[]>(() => [])
  const [value, setValue] = useState('')
  const restaurantId = useAppSelector(
    (state) => state.restaurant.restaurant.id
  )

  const getProduct = async (id: string) => {
    setIsLoading(true)
    try {
      const res = await apiGetProduct(id)
      if (res.status === 200) {
        setProductList(res.data)
        if (res.data.length === 0) {
          setProductList([])
        } else {
          setProductList(res.data)
        }
      }
    } catch (error) {
      console.log(error)
      setProductList([])
    }
    setIsLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const res = await apiGetCategory(restaurantId!)
      if (res.status === 200) {
        setCategoryList(res.data)
        setValue(res.data[0].id!.toString())
        getProduct(res.data[0].id!)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <>
      <Title Icon={IoFastFoodOutline} title={`${t('nav.products')}`} />
      <div className="flex flex-col gap-1">
        {categoryList.length <= 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            {/* <DoubleSidedImage
                            src="/img/others/no-notification.png"
                            darkModeSrc="/img/others/no-notification.png"
                            alt="Access Denied!"
                            className="h-[200px]"
                        /> */}
            <div className="mt-6 text-center">
              <h3 className="mb-2">{t('general.No data!')}</h3>
              <p className="text-base">
                {t(
                  'general.Add data or wait for it to be added'
                )}
              </p>
            </div>
          </div>
        ) : (
          <Tabs
            value={value}
            variant="pill"
            onChange={(tabValue) => {
              setValue(tabValue)
              getProduct(tabValue)
            }}
          >
            <TabList className="">
              {categoryList.map((item) => (
                <TabNav
                  key={item.id}
                  value={item.id!.toString()}
                >
                  <div className="w-fit flex gap-2 items-center justify-center">
                    <p className="whitespace-nowrap">
                      {i18n.language == 'ar'
                        ? JSON.parse(item.name!).ar
                        : JSON.parse(item.name!).en}
                    </p>
                  </div>
                </TabNav>
              ))}
            </TabList>
            <div className="p-4">
              {categoryList.map((item) => (
                <TabContent
                  key={item.id}
                  value={item.id!.toString()}
                >
                  <ProductTabel
                    setProductList={setProductList}
                    categoryId={item.id!}
                    getProduct={getProduct}
                    productList={productList}
                    isLoading={isLoading}
                  />
                </TabContent>
              ))}
            </div>
          </Tabs>
        )}
      </div>
    </>
  )
}

export default Products
