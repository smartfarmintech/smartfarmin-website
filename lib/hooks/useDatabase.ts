"use client"

import { useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

export function useDatabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const query = useCallback(
    async (table: string, options?: any) => {
      try {
        let query = supabase.from(table).select("*")

        if (options?.eq) {
          Object.entries(options.eq).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }

        if (options?.range) {
          query = query.range(options.range.from, options.range.to)
        }

        if (options?.order) {
          query = query.order(options.order.column, {
            ascending: options.order.ascending ?? true,
          })
        }

        const { data, error } = await query

        if (error) throw error
        return { data, error: null }
      } catch (error) {
        console.error("[v0] Query error:", error)
        return { data: null, error }
      }
    },
    [supabase]
  )

  const insert = useCallback(
    async (table: string, data: any) => {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .insert([data])
          .select()

        if (error) throw error
        return { data: result, error: null }
      } catch (error) {
        console.error("[v0] Insert error:", error)
        return { data: null, error }
      }
    },
    [supabase]
  )

  const update = useCallback(
    async (table: string, id: string, data: any) => {
      try {
        const { data: result, error } = await supabase
          .from(table)
          .update(data)
          .eq("id", id)
          .select()

        if (error) throw error
        return { data: result, error: null }
      } catch (error) {
        console.error("[v0] Update error:", error)
        return { data: null, error }
      }
    },
    [supabase]
  )

  const remove = useCallback(
    async (table: string, id: string) => {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq("id", id)

        if (error) throw error
        return { error: null }
      } catch (error) {
        console.error("[v0] Delete error:", error)
        return { error }
      }
    },
    [supabase]
  )

  return { query, insert, update, remove, supabase }
}
