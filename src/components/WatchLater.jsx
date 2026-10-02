import { useGlobalContext } from './Context';
import RenderList from './RenderList';

export default function WatchLater() {
    const { watchLater } = useGlobalContext();
    return (
        <div className="search-result-background">
            <div className="heading">Watch Later :</div>
            <RenderList
                list={watchLater.map(w => w.item)}
                noResult={true}
                type="items"
                compact={false}
                showMore={false}
                watchLater={true}
            />
        </div>
    );
}