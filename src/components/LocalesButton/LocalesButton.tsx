import { useI18nLocalStorage } from '@/lib/i18n'

export default function LocalesButton() {
  const [localeState, setLocale] = useI18nLocalStorage()

  function updateLocal() {
    if (localeState === 'zh') {
      setLocale('en')
    }
    if (localeState === 'en') {
      setLocale('zh')
    }
  }

  return (
    <>
      <div
        onClick={updateLocal}
        className="flex items-center justify-center border-slate-300 border-[1px] rounded-[4px] text-[10px] w-[20px] h-[20px] cursor-pointer hover:text-sky-500"
      >
        {localeState === 'zh' ? '中' : 'EN'}
      </div>
    </>
  )
}
