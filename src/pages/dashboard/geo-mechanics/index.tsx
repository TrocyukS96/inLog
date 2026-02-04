import { WellLogPlotDemo } from "../../../features/geo-mechanics/well-log-plot"

const GeoMechanicsPage = () => {
    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-4" >
            <h1 className="text-2xl font-bold mb-4">Geo Mechanics</h1>
            <WellLogPlotDemo />
        </div>
    )
}

export default GeoMechanicsPage