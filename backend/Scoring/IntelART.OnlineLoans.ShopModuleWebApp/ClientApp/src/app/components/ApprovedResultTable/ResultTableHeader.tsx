import React from 'react'

export interface IResultTableHeaderProps {
  refinancing: boolean;
}

const ResultTableHeader: React.FC<IResultTableHeaderProps> = props => {
  const { refinancing } = props
  return (
    <thead>
      <tr>
        <th>Վարկի ժամկետ</th>
        <th>Վարկի գումար</th>
        <th>Վարկի տոկոսադրույք</th>
        <th>Ամսական մարում</th>
      </tr>
    </thead>
  )
}

export default ResultTableHeader
