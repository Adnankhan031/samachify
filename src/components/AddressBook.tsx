'use client'

import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash2, Pencil, Star, Home, Briefcase, Loader2, X } from 'lucide-react'
import {
  listAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress,
  type Address, type AddressInput,
} from '@/lib/addresses'
import DeliveryPin, { type DeliveryPoint } from '@/components/DeliveryPin'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Andaman & Nicobar', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep',
]

const EMPTY: AddressInput = {
  label: 'Home', name: '', phone: '', pincode: '', house_no: '', area: '', landmark: '', city: '', state: '', latitude: null, longitude: null,
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [editing, setEditing] = useState<{ id: string | null; data: AddressInput } | null>(null)
  const [form, setForm] = useState<AddressInput>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = () => listAddresses().then(setAddresses)
  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setEditing({ id: null, data: EMPTY }); setError(null) }
  const openEdit = (a: Address) => {
    const data: AddressInput = {
      label: a.label, name: a.name, phone: a.phone, pincode: a.pincode,
      house_no: a.house_no, area: a.area, landmark: a.landmark, city: a.city, state: a.state,
      latitude: a.latitude, longitude: a.longitude,
    }
    setForm(data); setEditing({ id: a.id, data }); setError(null)
  }
  const close = () => { setEditing(null); setError(null) }

  const validate = (f: AddressInput): string | null => {
    if (!f.name.trim()) return 'Please enter a name.'
    if (!/^[0-9]{10}$/.test(f.phone.replace(/\D/g, ''))) return 'Enter a valid 10-digit mobile number.'
    if (!/^[0-9]{6}$/.test(f.pincode)) return 'Enter a valid 6-digit pincode.'
    if (!f.house_no.trim() || !f.area.trim() || !f.city.trim() || !f.state.trim()) return 'Please fill in the full address.'
    if (f.latitude == null || f.longitude == null) return 'Choose the exact delivery point on the map or use your current location.'
    return null
  }

  const save = async () => {
    const v = validate(form)
    if (v) { setError(v); return }
    setSaving(true)
    if (editing?.id) await updateAddress(editing.id, form)
    else await createAddress({ ...form, is_default: (addresses?.length ?? 0) === 0 })
    setSaving(false)
    close()
    load()
  }

  const remove = async (id: string) => { await deleteAddress(id); load() }
  const makeDefault = async (id: string) => { await setDefaultAddress(id); load() }

  const set = (k: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-9 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
            <MapPin size={17} className="text-green-600" />
          </div>
          <h2 className="font-display font-800 text-gray-900 text-lg">Saved addresses</h2>
        </div>
        {!editing && (
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-700 rounded-xl text-sm transition-colors">
            <Plus size={15} /> Add
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['Home', 'Work'] as const).map((t) => {
              const Icon = t === 'Home' ? Home : Briefcase
              const active = form.label === t
              return (
                <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, label: t }))}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 border transition-all ${active ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <Icon size={15} /> {t}
                </button>
              )
            })}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Full name" value={form.name} onChange={set('name')} placeholder="Recipient name" />
            <Input label="Mobile number" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
          </div>

          <DeliveryPin
            value={form.latitude != null && form.longitude != null ? { latitude: form.latitude, longitude: form.longitude } : null}
            onChange={(point: DeliveryPoint) => setForm((f) => ({ ...f, latitude: point.latitude, longitude: point.longitude }))}
          />
          <Input label="Pincode" value={form.pincode} onChange={set('pincode')} placeholder="6-digit pincode" inputMode="numeric" maxLength={6} />
          <Input label="Flat, House no., Building" value={form.house_no} onChange={set('house_no')} placeholder="e.g. 12A, Green Residency" />
          <Input label="Area, Street, Sector" value={form.area} onChange={set('area')} placeholder="e.g. Anna Nagar" />
          <Input label="Landmark (optional)" value={form.landmark} onChange={set('landmark')} placeholder="e.g. Near Apollo Hospital" />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Town / City" value={form.city} onChange={set('city')} placeholder="City" />
            <label className="block">
              <span className="block text-xs font-700 text-gray-600 mb-1.5">State</span>
              <select value={form.state} onChange={set('state')}
                className={`w-full px-4 py-3 bg-white border rounded-2xl outline-none text-sm appearance-none ${form.state ? 'text-gray-900' : 'text-gray-400'} border-gray-200 focus:border-green-400`}>
                <option value="" disabled>Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-800 rounded-xl text-sm transition-colors">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {editing.id ? 'Save changes' : 'Add address'}
            </button>
            <button onClick={close} className="inline-flex items-center gap-1.5 px-5 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-700 rounded-xl text-sm transition-colors">
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      ) : addresses === null ? (
        <div className="py-8 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-green-100 border-t-green-600 animate-spin" /></div>
      ) : addresses.length === 0 ? (
        <p className="text-gray-400 text-sm py-4">No saved addresses yet. Add one to check out faster next time.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-800 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{a.label}</span>
                  {a.is_default && <span className="text-[10px] font-800 text-green-700 inline-flex items-center gap-1"><Star size={11} className="fill-green-600 text-green-600" /> Default</span>}
                </div>
                <p className="font-700 text-gray-900 text-sm">{a.name} · {a.phone}</p>
                <p className="text-xs text-gray-500">{a.house_no}, {a.area}{a.landmark ? `, ${a.landmark}` : ''}, {a.city}, {a.state} — {a.pincode}</p>
                {a.latitude != null && a.longitude != null && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${a.latitude},${a.longitude}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-700 text-green-700 hover:text-green-800">
                    <MapPin size={12} /> View saved pin
                  </a>
                )}
                <div className="flex items-center gap-3 mt-2.5">
                  {!a.is_default && (
                    <button onClick={() => makeDefault(a.id)} className="text-xs font-700 text-green-700 hover:text-green-800">Set as default</button>
                  )}
                  <button onClick={() => openEdit(a)} className="text-xs font-700 text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"><Pencil size={12} /> Edit</button>
                  <button onClick={() => remove(a.id)} className="text-xs font-700 text-gray-500 hover:text-red-500 inline-flex items-center gap-1"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Input({ label, value, onChange, placeholder, inputMode, maxLength }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; inputMode?: 'text' | 'numeric'; maxLength?: number
}) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-gray-600 mb-1.5">{label}</span>
      <input value={value} onChange={onChange} placeholder={placeholder} inputMode={inputMode} maxLength={maxLength}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none text-gray-900 placeholder:text-gray-400 text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" />
    </label>
  )
}
