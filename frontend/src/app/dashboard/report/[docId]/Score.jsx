'use client';
import Image from "next/image";

export default function Score({ favourability_score }) {
    return (
        <div className="flex flex-col items-center p-4 gap-4 rounded-md border-border bg-transparent">

            <Image alt="Favourability Score" height={256} width={256} src={`https://quickchart.io/chart?c={type:'radialGauge',data:{datasets:[{data:[${favourability_score}],backgroundColor:'red'}]}}`} />
            <p className="text-sm">Favourability Score</p>
        </div>
    )
}
