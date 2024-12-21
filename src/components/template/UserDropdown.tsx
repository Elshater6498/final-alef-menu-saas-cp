import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout, HiOutlineMail, HiOutlineUser } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store'
import { useState } from 'react'
import { MdOutlinePhoneIphone, MdPassword } from 'react-icons/md'
import ChangePasswordDialog from '@/views/auth/ChangePasswordDialog'
import dayjs from 'dayjs'
import { AuthorityCheck } from '../shared'

type DropdownList = {
  label: string
  path: string
  icon: JSX.Element
}

const dropdownItemList: DropdownList[] = []

const _UserDropdown = ({ className }: CommonProps) => {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const user = useAppSelector((state) => state.auth.user)
  const userAuthority = useAppSelector((state) => state.auth.user.authority)
  const [dialogIsOpenChangePassword, setdialogIsOpenChangePassword] =
    useState(false)

  const UserAvatar = (
    <div className={classNames(className, 'flex items-center gap-2')}>
      <Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
      <div className="hidden md:block">
        <div className="text-xs capitalize">
          {user.role === 1 ? 'Admin' : 'restourant'}
        </div>
        <div className="font-bold">{user.name}</div>
      </div>
    </div>
  )

  // handel Dialog change password
  const openDialogChangePassword = () => {
    setdialogIsOpenChangePassword(true)
  }
  const onDialogCloseChangePassword = () => {
    setdialogIsOpenChangePassword(false)
  }
  // handel Dialog change password

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar shape="circle" icon={<HiOutlineUser />} />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {user.name}
              </div>
              <div className="text-xs">{user.email}</div>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 space-y-2 gap-2">
            <div className="flex gap-2 items-center"><HiOutlineUser />  {user.name}</div>
            <div className="flex gap-2 items-center"><MdOutlinePhoneIphone />  {user.phone}</div>
            <div className="flex gap-2 items-center"><HiOutlineMail />  {user.email}</div>
            <AuthorityCheck
              userAuthority={userAuthority!}
              authority={["3", "4"]}
            >

              <div className="flex gap-2 items-center">{t('client-management.dueDate')} : {dayjs(user.dueDate).format('DD / MM / YYYY')}</div>
            </AuthorityCheck>
          </div>
        </Dropdown.Item>
        {/* {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))} */}
        <Dropdown.Item variant="divider" />
        <Dropdown.Item
          eventKey="Sign Out"
          className="gap-2"
          onClick={openDialogChangePassword}
        // variant="divider"
        >
          <span className="text-xl opacity-50">
            <MdPassword />
          </span>
          <span>{t('general.change-password')}</span>
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="Sign Out"
          className="gap-2"
          onClick={signOut}
        >
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>{t('general.sign-out')}</span>
        </Dropdown.Item>
      </Dropdown>
      <ChangePasswordDialog
        dialogIsOpen={dialogIsOpenChangePassword}
        onDialogeClose={onDialogCloseChangePassword}
      />
    </div>
  )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
