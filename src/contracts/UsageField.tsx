import React from 'react';
import UsagePieChart from '../components/UsagePieChart';
import formStyles from '../styles/Forms.module.css';

interface MyProps {
  title: string,
  used: number,
  available: number
}

export const UsageField = (props: MyProps) => {
  return (
    <div
      style={{
        marginRight: 100,
        textAlign: 'center'
      }}
    >
      <div className={formStyles.LabelTitle}>
        {props.title}
      </div>
      <UsagePieChart
        used={props.used}
        available={props.available}
      />
    </div>
  )
}