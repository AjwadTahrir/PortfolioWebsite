import { useState, useEffect, useMemo } from 'react'
import { fetchTable } from '../../lib/publicFetch'

/**
 * Reads a public table via the PostgREST endpoint directly.
 * Same key and same RLS rules as the Supabase SDK — just without
 * pulling auth/realtime/storage into the public bundle.
 *
 * @param {string} table   table name, e.g. 'projects'
 * @param {object} params  PostgREST query params, e.g. { order: 'year.desc' }
 */
export function useSupabaseTable(table, params) {
  const key = JSON.stringify(params ?? {})
  const query = useMemo(() => JSON.parse(key), [key])

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetchTable(table, query)
      .then(rows => {
        if (!cancelled) setData(rows)
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setData([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [table, query])

  return { data, loading, error }
}

export default useSupabaseTable