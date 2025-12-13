


const DashboardHeader = ({ imageUrl, title, description }: { imageUrl: string, title: string, description: string }) => {
    return (
        <div className="flex items-center justify-between">
           <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                    {title}
                </h1>
                <p className="text-sm sm:text-base text-foreground/80">{description}</p>
           </div>
           <div className="">
                <img src={imageUrl} alt="" className="w-12 sm:w-18 lg:w-24  object-cover" />
           </div>
        </div>
    )
}

export default DashboardHeader;