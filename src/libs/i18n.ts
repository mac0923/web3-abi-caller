import { i18n } from '@lingui/core'
import { createGlobalState, useLocalStorage } from 'react-use'
import { LocaleKey } from '@/config/storageKeys'
import { useEffect } from 'react'

const locales = {
  en: 'English',
  zh: '中文',
}
const DefaultLocale = 'en'

async function dynamicActivate(locale: string) {
  const { messages } = await import(`../locales/${locale}/messages.po`)

  i18n.load(locale, messages)
  i18n.activate(locale)
}

function getI18nFromStorage(): string | undefined {
  const v = window.localStorage.getItem(LocaleKey)
  const value = v ? JSON.parse(v) : undefined
  if (!value || !Object.keys(locales).some(v => v == value)) {
    return undefined
  }
  return value
}

function geDefaultLocale() {
  const storageLocale = getI18nFromStorage()
  if (storageLocale) {
    return storageLocale
  }

  const navigatorLocale = window.navigator.language.split('-')[0]
  if (navigatorLocale in locales) {
    return navigatorLocale
  }

  return DefaultLocale
}

const defaultLocal = geDefaultLocale()

const useI18nState = createGlobalState(defaultLocal)

export function useI18nLocalStorage() {
  const [localeState, setLocaleState] = useI18nState()
  const [, setLocalToStorage] = useLocalStorage(LocaleKey, defaultLocal)

  useEffect(() => {
    dynamicActivate(localeState).then(() => {
      setLocalToStorage(localeState)
    })
  })

  function setLocale(locale: string) {
    dynamicActivate(locale).then(() => {
      setLocaleState(locale)
      setLocalToStorage(locale)
    })
  }

  return [localeState, setLocale] as const
}
