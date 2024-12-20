import "./scoring-guide-table.css"
import React from 'react'

// score-multiplier-table
// score-multiplier__cell
const ScoreGuideTable: React.FC = () => {
	const rowOne = () => {
		const markedCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		return markedCount.map(number => {
			return <td className='score-guide-table__cell'>{number}x</td>
		})
	}

	const rowTwo = () => {
		const scoreCount = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78]
		return scoreCount.map(number => {
			return <td className='score-guide-table__cell'>{number}</td>
		})
	}

	return (
		<table className='score-guide-table'>
			<caption>Scoring Guide</caption>
			<tr>
				<td className="score-guide-table__cell">Marked</td>
				{rowOne()}
			</tr>
			<tr>
				<td className="score-guide-table__cell">Score</td>
				{rowTwo()}
			</tr>
		</table>
	)
}

export default ScoreGuideTable;
