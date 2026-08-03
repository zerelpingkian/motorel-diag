import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Brand, MotorcycleModel } from '../types';
import { SEED_BRANDS, SEED_MODELS } from '../data/seedData';

export const motorcycleService = {
  async getBrands(): Promise<Brand[]> {
    if (!isSupabaseConfigured() || !supabase) return SEED_BRANDS;

    const { data, error } = await supabase
      .from('motorcycle_brands')
      .select('*');

    if (error || !data || data.length === 0) return SEED_BRANDS;

    return data.map((b) => ({
      id: b.id,
      name: b.name,
      country: 'Japan',
      logoUrl: b.logo_url
    }));
  },

  async getModels(): Promise<MotorcycleModel[]> {
    if (!isSupabaseConfigured() || !supabase) return SEED_MODELS;

    const { data, error } = await supabase
      .from('motorcycle_models')
      .select('*, motorcycle_brands(name)');

    if (error || !data || data.length === 0) return SEED_MODELS;

    return data.map((m: any) => ({
      id: m.id,
      brandId: m.brand_id,
      brandName: m.motorcycle_brands?.name || 'Honda',
      modelName: m.model_name,
      category: 'Scooter',
      engineDisplacement: `${m.engine_cc}cc`,
      fuelSystem: m.fuel_system as any,
      transmission: 'Automatic (CVT)',
      coolingSystem: 'Liquid Cooled',
      oilCapacity: '0.8L',
      sparkPlugType: 'CPR9EA-9',
      batteryType: 'YTZ6V (12V 5Ah)',
      tireSizeFront: '90/80-14',
      tireSizeRear: '100/80-14',
      imageUrl: m.image_url || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
      description: 'Reliable automatic motorcycle.',
      commonIssues: ['No Crank / Dead Battery', 'CVT Noise / Dragging']
    }));
  },

  async createModel(data: Partial<MotorcycleModel>): Promise<MotorcycleModel> {
    if (!isSupabaseConfigured() || !supabase) {
      const newModel: MotorcycleModel = {
        id: `m_${Date.now()}`,
        brandId: data.brandId || 'b_honda',
        brandName: data.brandName || 'Honda',
        modelName: data.modelName || 'New Model',
        category: data.category || 'Scooter',
        engineDisplacement: data.engineDisplacement || '125cc',
        fuelSystem: data.fuelSystem || 'Fuel Injection (FI)',
        transmission: data.transmission || 'Automatic (CVT)',
        coolingSystem: data.coolingSystem || 'Liquid Cooled',
        oilCapacity: data.oilCapacity || '0.8L',
        sparkPlugType: data.sparkPlugType || 'Standard',
        batteryType: data.batteryType || '12V',
        tireSizeFront: '90/80-14',
        tireSizeRear: '100/80-14',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
        description: data.description || 'Custom motorcycle model.',
        commonIssues: []
      };
      return newModel;
    }

    let created: any = null;
    try {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .insert({
          brand_id: data.brandId,
          model_name: data.modelName,
          engine_cc: parseInt(data.engineDisplacement?.replace(/\D/g, '') || '125'),
          fuel_system: data.fuelSystem,
          image_url: data.imageUrl
        })
        .select()
        .single();
      if (error) console.warn('Supabase model insert warning:', error);
      created = data;
    } catch (e) {
      console.warn('Supabase model insert error:', e);
    }

    const fallbackId = created?.id || `m_${Date.now()}`;
    return {
      id: fallbackId,
      brandId: created?.brand_id || data.brandId || 'b_honda',
      brandName: data.brandName || 'Honda',
      modelName: created?.model_name || data.modelName || 'New Model',
      category: data.category || 'Scooter',
      engineDisplacement: created?.engine_cc ? `${created.engine_cc}cc` : (data.engineDisplacement || '125cc'),
      fuelSystem: (created?.fuel_system || data.fuelSystem || 'Fuel Injection (FI)') as any,
      transmission: data.transmission || 'Automatic (CVT)',
      coolingSystem: data.coolingSystem || 'Liquid Cooled',
      oilCapacity: data.oilCapacity || '0.8L',
      sparkPlugType: data.sparkPlugType || 'Standard',
      batteryType: data.batteryType || '12V',
      tireSizeFront: '90/80-14',
      tireSizeRear: '100/80-14',
      imageUrl: created?.image_url || data.imageUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
      description: data.description || 'Custom motorcycle model.',
      commonIssues: data.commonIssues || []
    };
  }
};
