import { useCallback } from 'react'
import useDarkMode from '@/utils/hooks/useDarkmode'
import Switcher from '@/components/ui/Switcher'
import { Button } from '@/components/ui'
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md'

const ModeSwitcher = () => {
    const [isDark, setIsDark] = useDarkMode()

    const onSwitchChange = useCallback(
        (checked: boolean) => {
            setIsDark(checked ? 'dark' : 'light')
        },
        [setIsDark]
    )

    return (
        <div className="flex gap-1 items-center">
            {isDark ? (
                <Button
                    shape="circle"
                    size="sm"
                    icon={<MdOutlineLightMode className="text-2xl" />}
                    onClick={() => onSwitchChange(false)}
                />
            ) : (
                <Button
                    shape="circle"
                    size="sm"
                    icon={<MdOutlineDarkMode className="text-2xl" />}
                    onClick={() => onSwitchChange(true)}
                />
            )}
        </div>
    )
}

export default ModeSwitcher
