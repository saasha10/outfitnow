const supabase = require('../config/supabaseClient');

async function addClothingItem(item) {
  const { data, error } = await supabase
    .from('clothing_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getClothingByUserId(userId) {
  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function deleteClothingItem(id) {
  const { data, error } = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  addClothingItem,
  getClothingByUserId,
  deleteClothingItem,
};
