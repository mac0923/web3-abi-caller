import { StyleProps } from 'react-json-view-lite/dist/DataRenderer'
import styles from '@/styles/json.module.css'

export const CustomDarkJsonStyle: StyleProps = {
  container: styles['container-dark'],
  basicChildStyle: styles['basic-element-style'],
  label: styles['label-dark'],
  clickableLabel: styles['clickable-label-dark'],
  nullValue: styles['value-null-dark'],
  undefinedValue: styles['value-undefined-dark'],
  stringValue: styles['value-string-dark'],
  booleanValue: styles['value-boolean-dark'],
  numberValue: styles['value-number-dark'],
  otherValue: styles['value-other-dark'],
  punctuation: styles['punctuation-dark'],
  collapseIcon: styles['collapse-icon-dark'],
  expandIcon: styles['expand-icon-dark'],
  collapsedContent: styles['collapsed-content-dark'],
  noQuotesForStringValues: false,
}
