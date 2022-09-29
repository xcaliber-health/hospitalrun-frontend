import React, { useEffect } from 'react'

import { useUpdateTitle } from '../page-header/title/TitleContext'
import useTranslator from '../shared/hooks/useTranslator'

const Dashboard: React.FC = () => {
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('dashboard.label'))
  })
  return (
    <>
      <h3>Practice Summary</h3>
      <img
        src="banner.svg"
        style={{
          objectFit: 'fill',
          height: '79vh',
          width: '100%',
        }}
        alt="under construction banner"
      />
    </>
  )
}

export default Dashboard
