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
        src="banner.jpg"
        style={{
          height: '78vh',
          width: '50vw',
          marginLeft: '13vw',
        }}
        alt="under construction banner"
      />
    </>
  )
}

export default Dashboard
