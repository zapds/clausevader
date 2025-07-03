'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { useState } from 'react'
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useTooltip } from '@nivo/tooltip'
import React from 'react'

// 👇 Custom Layer definition
const CustomHoverLayer = ({ nodes, setHoveredClause }) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip()

  return (
    <>
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={12}
          fill="transparent"
          onMouseMove={(event) => {
            setHoveredClause(node.data)
            showTooltipFromEvent(
              <div className="bg-background w-48 border rounded px-3 py-1 text-sm shadow">
                Clause: <strong>{node.data.clause_text}</strong>
              </div>,
              event,
              'right'
            )
          }}
        />
      ))}
    </>
  )
}

export default function Report({ clausesData }) {
  const [hoveredClause, setHoveredClause] = useState(null)

  const data = [
    {
      id: 'Clauses',
      data: clausesData.map((clause) => ({
        x: clause.x,
        y: clause.y,
        ...clause,
      })),
    },
  ]

  return (
    <div className="flex flex-col md:flex-row relative h-screen w-full p-4 gap-4">
      {/* Chart + Labels */}
      <div className="flex-1 relative h-[50vh]">
        {/* Axes Labels */}
        <div className="absolute top-4 left-4 text-white text-xs">👈 User favourable</div>
        <div className="absolute top-4 right-4 text-white text-xs">Other party favourable 👉</div>
        <div className="absolute bottom-4 left-4 text-white text-xs">⬇ Lowest importance</div>
        <div className="absolute bottom-4 right-4 text-white text-xs">Highest importance ⬆</div>

        <ResponsiveScatterPlot
          data={data}
          margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
          xScale={{ type: 'linear', min: 0, max: 1 }}
          yScale={{ type: 'linear', min: 0, max: 1 }}
          blendMode="multiply"
          nodeSize={20}
          colors={(d) => {
            switch (d.impact) {
              case 'favourable':
                return '#16a34a'
              case 'unfavourable':
                return '#dc2626'
              default:
                console.log(d.impact)
                return '#dc2626'
            }
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickValues: [0, 1],
            tickSize: 0,
            tickPadding: 10,
          }}

          axisLeft={{
            tickValues: [0, 1],
            tickSize: 0,
            tickPadding: 10,
          }}
          onClick={(node) => setSelected(node.data.id)}
          layers={[
            'grid',
            'axes',
            'nodes',
            (props) => <CustomHoverLayer {...props} setHoveredClause={setHoveredClause} />,
          ]}
          theme={{
            tooltip: {
              container: {
                fontSize: '12px',
                borderRadius: '6px',
                textTransform: 'capitalize',
              },
            },
            grid: {
              line: {
                stroke: '#333333',
              },
            },
          }}
          role="application"
        />
      </div>

      {/* Sidebar with full clause info */}
      <div className="w-[400px] h-[50vh]">
        {hoveredClause ? (
          <Card className="w-full text-left">
            <CardHeader>
              <CardTitle className="text-sm">{hoveredClause.summary}</CardTitle>
              <CardDescription className="text-xs">Impact: {hoveredClause.impact}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm overflow-auto max-h-[80vh]">
              <div>
                <strong>Favorability Score:</strong> {hoveredClause.favorability_score}
              </div>
              <div>
                <strong>Clause Text:</strong>
                <div className="text-muted-foreground">{hoveredClause.clause_text}</div>
              </div>
              {hoveredClause.pros?.length > 0 && (
                <div>
                  <strong>Pros:</strong>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {hoveredClause.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {hoveredClause.cons?.length > 0 && (
                <div>
                  <strong>Cons:</strong>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {hoveredClause.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <strong>Suggested Rewrite:</strong>
                <div className="text-muted-foreground">{hoveredClause.suggested_rewrite}</div>
              </div>
              <div>
                <strong>Sith View:</strong>
                <div className="italic text-muted-foreground">{hoveredClause.sith_view}</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            Hover over a clause to view details
          </div>
        )}
      </div>
    </div>
  )
}
