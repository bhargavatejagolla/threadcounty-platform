import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { InspectionRecord } from '@/types/inspection';

export function useInspections() {
  return useQuery({
    queryKey: ['inspections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as InspectionRecord[];
    },
  });
}

export function useInspection(id: string) {
  return useQuery({
    queryKey: ['inspections', id],
    queryFn: async () => {
      if (id === 'local' || id.startsWith('local_')) {
        const local = localStorage.getItem('local_inspections');
        if (local) {
          const arr = JSON.parse(local);
          if (Array.isArray(arr)) {
            const found = arr.find((r: any) => r.id === id);
            if (found) return found as InspectionRecord;
          }
        }
        // Fallback for older singular item
        const oldLocal = localStorage.getItem('local_inspection');
        if (oldLocal) return JSON.parse(oldLocal) as InspectionRecord;
        throw new Error('Local inspection not found');
      }

      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as InspectionRecord;
    },
    enabled: !!id,
  });
}
