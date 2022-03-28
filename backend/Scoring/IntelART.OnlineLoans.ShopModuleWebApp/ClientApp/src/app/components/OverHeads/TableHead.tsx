import React from 'react'

const OverHeadsProdTableHead: React.FC<{}> = props => {
  return (
    <thead>
      <tr className="bg-gray">
        <th>Ապրանքի համար</th>
        <th>Ապրանքի ինքնարժեք</th>
        <th>Ապրանքի վաճառքի գին</th>
        <th>Մասնաբաժինը վաճառքների մեջ</th>
      </tr>
    </thead>
  )
}

export default OverHeadsProdTableHead
