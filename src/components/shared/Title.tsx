import { IconType } from "react-icons"

const Title = ({ Icon, title }: { Icon: IconType ,title: string }) => {
    return (
        <div className="flex gap-2 items-center mb-4">
            <Icon className="text-3xl dark:text-white" />
            <h3 className="text-xl font-medium text-gray-500">{title}</h3>
        </div>
    )
}

export default Title