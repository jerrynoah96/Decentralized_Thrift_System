import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

const PurseCardSkeleton = () => {
    return(
        <SkeletonTheme color="#7fbdaa" highlightColor="#b2d8cd">
            <div className = "purseCard">
                <div className = "purse-card-header">
                    <h1 className = "purse-id">
                        <Skeleton duration={1} height={25} width={200} />
                    </h1>
                    <span className = "status-icon">
                        <Skeleton duration={1} height={20} width={20} />
                    </span>
                </div>
                <div className = "purse-card-body">
                    <div className = "details">
                        <p className = "key">
                            <Skeleton duration={1} height={16} width={100} />
                        </p>
                        <p className = "value">
                            <Skeleton duration={1} height={20} width={80} />
                        </p>
                    </div>
                    <div className = "details">
                        <p className = "key">
                            <Skeleton duration={1} height={16} width={100} />
                        </p>
                        <p className = "value">
                            <Skeleton duration={1} height={20} width={80} />
                        </p>
                    </div>
                    <div className = "details">
                        <p className = "key">
                            <Skeleton duration={1} height={16} width={100} />
                        </p>
                        <p className = "value">
                            <Skeleton duration={1} height={20} width={80} />
                        </p>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    )
}

export default PurseCardSkeleton;