import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Package, ClipboardList, Wallet, ChefHat, AlertTriangle, CheckCircle2, Plus, Flame, TrendingUp, Receipt, Sparkles, X, PlusCircle, Pizza, Lock, Mail, Eye, EyeOff, LogOut, User, ArrowRight } from 'lucide-react';

const initialInventory = {
  'Pizza Dough': { stock: 40, unit: 'pcs', costPerUnit: 25 },
  'Tomato Sauce': { stock: 35, unit: 'tubs', costPerUnit: 18 },
  'Cheese': { stock: 12, unit: 'kg', costPerUnit: 220 },
  'Pepperoni': { stock: 18, unit: 'kg', costPerUnit: 350 },
};

const initialOrders = [
  {
    id: 101,
    label: 'Order #101',
    item: 'Large Cheese Pizza',
    customer: 'Aarav Mehta',
    price: 449,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 2 },
  },
  {
    id: 102,
    label: 'Order #102',
    item: 'Pepperoni Feast Pizza',
    customer: 'Priya Shah',
    price: 599,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 1.5, 'Pepperoni': 1 },
  },
  {
    id: 103,
    label: 'Order #103',
    item: 'Medium Cheese Pizza',
    customer: 'Rohan Patel',
    price: 349,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 0.5, 'Cheese': 1 },
  },
  {
    id: 104,
    label: 'Order #104',
    item: 'Double Pepperoni Pizza',
    customer: 'Sneha Joshi',
    price: 649,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 1, 'Pepperoni': 2 },
  },
];

const initialSalesHistory = [
  { day: 'Mon', revenue: 2100 },
  { day: 'Tue', revenue: 2850 },
  { day: 'Wed', revenue: 1950 },
  { day: 'Thu', revenue: 3200 },
  { day: 'Fri', revenue: 2600 },
];

const todayLabel = 'Today';

const seedAdmins = [
  { name: 'Kitchen Admin', email: 'admin@bitesize.com', password: 'admin123' },
];

const pizzaMenu = [
  {
    name: 'Margherita Pizza',
    price: 299,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 1 },
  },
  {
    name: 'Medium Cheese Pizza',
    price: 349,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 0.5, 'Cheese': 1 },
  },
  {
    name: 'Large Cheese Pizza',
    price: 449,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 2 },
  },
  {
    name: 'Pepperoni Feast Pizza',
    price: 599,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 1.5, 'Pepperoni': 1 },
  },
  {
    name: 'Double Pepperoni Pizza',
    price: 649,
    consumes: { 'Pizza Dough': 1, 'Tomato Sauce': 1, 'Cheese': 1, 'Pepperoni': 2 },
  },
  {
    name: 'Custom Order',
    price: 0,
    consumes: {},
  },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(' ');
}

function StatusBadge({ low }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        low
          ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
          : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
      )}
    >
      {low ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
      {low ? 'Low Stock' : 'In Stock'}
    </span>
  );
}

function KitchenTracker({ inventory, onRestock }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Kitchen Tracker</h2>
        <p className="text-slate-500 mt-1">Live raw-ingredient inventory for the kitchen.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Ingredient</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Current Stock</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Unit</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(inventory).map(([name, info], idx) => {
              const low = info.stock < 15;
              return (
                <tr
                  key={name}
                  className={classNames(
                    'border-b border-slate-50 last:border-0 transition-colors',
                    low ? 'bg-red-50/40' : 'hover:bg-amber-50/40'
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <Package size={17} />
                      </div>
                      <span className="font-semibold text-slate-700">{name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={classNames(
                        'text-lg font-bold tabular-nums',
                        low ? 'text-red-600' : 'text-slate-700'
                      )}
                    >
                      {info.stock % 1 === 0 ? info.stock : info.stock.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{info.unit}</td>
                  <td className="px-6 py-4">
                    <StatusBadge low={low} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRestock(name)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all"
                    >
                      <Plus size={15} />
                      Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 ring-1 ring-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Sparkles size={17} />
        </div>
        <p className="text-sm text-amber-800">
          Restocking adds <span className="font-semibold">20 units</span> to an ingredient's current stock. Items
          below <span className="font-semibold">15 units</span> are automatically flagged as{' '}
          <span className="font-semibold">Low Stock</span>.
        </p>
      </div>
    </div>
  );
}

function OrderDesk({ orders, inventory, onFulfill, onNewOrder }) {
  const canFulfill = (order) =>
    Object.entries(order.consumes).every(([ing, qty]) => (inventory[ing]?.stock ?? 0) >= qty);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Order Desk</h2>
          <p className="text-slate-500 mt-1">Incoming customer orders waiting to be cooked and fulfilled.</p>
        </div>
        <button
          onClick={onNewOrder}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <PlusCircle size={17} />
          New Order
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
            <CheckCircle2 size={26} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">All caught up</h3>
          <p className="text-slate-500 mt-1">No incoming orders right now. Create one to get started.</p>
          <button
            onClick={onNewOrder}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <PlusCircle size={17} />
            New Order
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((order) => {
            const fulfillable = canFulfill(order);
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{order.label}</p>
                    <h3 className="text-lg font-bold text-slate-800 mt-0.5">{order.item}</h3>
                    <p className="text-sm text-slate-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Order value</p>
                    <p className="text-lg font-bold text-emerald-600">₹{order.price}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Ingredients required
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(order.consumes).map(([ing, qty]) => {
                      const available = (inventory[ing]?.stock ?? 0) >= qty;
                      return (
                        <span
                          key={ing}
                          className={classNames(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1',
                            available
                              ? 'bg-slate-50 text-slate-600 ring-slate-200'
                              : 'bg-red-50 text-red-600 ring-red-200'
                          )}
                        >
                          {ing} · {qty % 1 === 0 ? qty : qty.toFixed(1)} {inventory[ing]?.unit}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onFulfill(order)}
                  disabled={!fulfillable}
                  className={classNames(
                    'mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm shadow-sm transition-all',
                    fulfillable
                      ? 'bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  )}
                >
                  <Flame size={17} />
                  {fulfillable ? 'Fulfill & Cook' : 'Insufficient Stock'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NewOrderModal({ inventory, onClose, onCreate }) {
  const [selectedMenu, setSelectedMenu] = useState(pizzaMenu[0].name);
  const [customer, setCustomer] = useState('');
  const [price, setPrice] = useState(String(pizzaMenu[0].price));
  const [customIngredients, setCustomIngredients] = useState({});
  const [error, setError] = useState('');

  const menuItem = pizzaMenu.find((m) => m.name === selectedMenu);
  const isCustom = selectedMenu === 'Custom Order';

  const handleMenuChange = (name) => {
    setSelectedMenu(name);
    const item = pizzaMenu.find((m) => m.name === name);
    setPrice(String(item.price));
    if (name === 'Custom Order') {
      setCustomIngredients(
        Object.fromEntries(Object.keys(inventory).map((ing) => [ing, '']))
      );
    }
  };

  const handleCustomQtyChange = (ing, value) => {
    setCustomIngredients((prev) => ({ ...prev, [ing]: value }));
  };

  const handleSubmit = () => {
    const trimmedCustomer = customer.trim() || 'Walk-in Customer';
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Enter a valid order value greater than 0.');
      return;
    }

    let consumes = {};
    if (isCustom) {
      consumes = Object.fromEntries(
        Object.entries(customIngredients)
          .map(([ing, qty]) => [ing, parseFloat(qty)])
          .filter(([, qty]) => !isNaN(qty) && qty > 0)
      );
      if (Object.keys(consumes).length === 0) {
        setError('Add at least one ingredient with a quantity greater than 0.');
        return;
      }
    } else {
      consumes = menuItem.consumes;
    }

    const newOrder = {
      id: Date.now(),
      label: `Order #${Math.floor(100 + Math.random() * 900)}`,
      item: isCustom ? 'Custom Pizza Order' : selectedMenu,
      customer: trimmedCustomer,
      price: parsedPrice,
      consumes,
    };

    onCreate(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Pizza size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">New Order</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Menu item
            </label>
            <div className="grid grid-cols-2 gap-2">
              {pizzaMenu.map((item) => {
                const active = item.name === selectedMenu;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleMenuChange(item.name)}
                    className={classNames(
                      'text-left px-3.5 py-2.5 rounded-xl text-sm font-medium ring-1 transition-all',
                      active
                        ? 'bg-amber-50 ring-amber-300 text-amber-700'
                        : 'bg-slate-50 ring-slate-100 text-slate-600 hover:ring-slate-200'
                    )}
                  >
                    {item.name}
                    {item.price > 0 && (
                      <span className="block text-xs text-slate-400 mt-0.5">₹{item.price}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Customer name
            </label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="e.g. Aarav Mehta"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Order value (₹)
            </label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>

          {isCustom ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Ingredients consumed
              </label>
              <div className="space-y-2">
                {Object.entries(inventory).map(([ing, info]) => (
                  <div key={ing} className="flex items-center gap-3">
                    <span className="flex-1 text-sm font-medium text-slate-600">{ing}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={customIngredients[ing] ?? ''}
                      onChange={(e) => handleCustomQtyChange(ing, e.target.value)}
                      placeholder="0"
                      className="w-24 px-3 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 text-right focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                    <span className="w-12 text-xs text-slate-400">{info.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Ingredients consumed
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(menuItem.consumes).map(([ing, qty]) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                  >
                    {ing} · {qty % 1 === 0 ? qty : qty.toFixed(1)} {inventory[ing]?.unit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 ring-1 ring-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all"
          >
            <PlusCircle size={17} />
            Add to Order Desk
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5 flex items-center gap-4">
      <div className={classNames('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', accent.bg, accent.text)}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800 tabular-nums">₹{value.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}

function FinancialRegister({ revenue, cost, salesHistory }) {
  const profit = revenue - cost;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Financial Register</h2>
        <p className="text-slate-500 mt-1">Live analytics, updated automatically as orders are cooked.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Receipt size={20} />}
          label="Total Revenue"
          value={revenue}
          accent={{ bg: 'bg-emerald-100', text: 'text-emerald-600' }}
        />
        <KpiCard
          icon={<Package size={20} />}
          label="Cost of Ingredients"
          value={cost}
          accent={{ bg: 'bg-amber-100', text: 'text-amber-600' }}
        />
        <KpiCard
          icon={<TrendingUp size={20} />}
          label="Net Profit"
          value={profit}
          accent={{ bg: 'bg-slate-100', text: 'text-slate-600' }}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-700">Sales — Last 5 Days</h3>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">in ₹</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 13 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ admins, onLogin, onSignup }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword(false);
  };

  const switchMode = (next) => {
    setMode(next);
    resetFields();
  };

  const handleSubmit = () => {
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError('Enter both email and password.');
      return;
    }

    if (isLogin) {
      const found = admins.find((a) => a.email.toLowerCase() === trimmedEmail);
      if (!found || found.password !== password) {
        setError('Invalid email or password.');
        return;
      }
      onLogin(found);
    } else {
      if (!name.trim()) {
        setError('Enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      const exists = admins.find((a) => a.email.toLowerCase() === trimmedEmail);
      if (exists) {
        setError('An admin account with this email already exists.');
        return;
      }
      const newAdmin = { name: name.trim(), email: trimmedEmail, password };
      onSignup(newAdmin);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm mb-3">
            <ChefHat size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">BiteSize ERP</h1>
          <p className="text-sm text-slate-400 mt-1">Admin console for cloud kitchen ops</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={classNames(
                'py-3.5 text-sm font-semibold transition-colors',
                isLogin ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-600'
              )}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={classNames(
                'py-3.5 text-sm font-semibold transition-colors',
                !isLogin ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-600'
              )}
            >
              Sign up
            </button>
          </div>

          <div onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }} className="px-6 py-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bitesize.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 ring-1 ring-red-100 rounded-xl px-3.5 py-2.5">{error}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-sm font-bold shadow-sm transition-all"
            >
              {isLogin ? 'Log in' : 'Create admin account'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {isLogin && (
          <p className="text-center text-xs text-slate-400 mt-4">
            Demo credentials: admin@bitesize.com / admin123
          </p>
        )}
      </div>
    </div>
  );
}

function Dashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('kitchen');
  const [inventory, setInventory] = useState(initialInventory);
  const [orders, setOrders] = useState(initialOrders);
  const [revenue, setRevenue] = useState(0);
  const [cost, setCost] = useState(0);
  const [salesHistory, setSalesHistory] = useState(initialSalesHistory);
  const [toast, setToast] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const handleRestock = (name) => {
    setInventory((prev) => ({
      ...prev,
      [name]: { ...prev[name], stock: prev[name].stock + 20 },
    }));
    setToast(`Restocked ${name} +20`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleFulfill = (order) => {
    let orderCost = 0;
    setInventory((prev) => {
      const next = { ...prev };
      Object.entries(order.consumes).forEach(([ing, qty]) => {
        orderCost += (prev[ing]?.costPerUnit ?? 0) * qty;
        next[ing] = { ...next[ing], stock: Math.max(0, next[ing].stock - qty) };
      });
      return next;
    });

    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    setRevenue((r) => r + order.price);
    setCost((c) => c + orderCost);
    setSalesHistory((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last.day === todayLabel) {
        next[next.length - 1] = { ...last, revenue: last.revenue + order.price };
      } else {
        next.push({ day: todayLabel, revenue: order.price });
        if (next.length > 5) next.shift();
      }
      return next;
    });

    setToast(`${order.label} cooked & fulfilled — ₹${order.price} added to revenue`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCreateOrder = (order) => {
    setOrders((prev) => [...prev, order]);
    setIsNewOrderOpen(false);
    setToast(`${order.label} added to Order Desk`);
    setTimeout(() => setToast(null), 2000);
  };

  const totalRevenue = revenue;
  const totalCost = cost;

  const navItems = useMemo(
    () => [
      { id: 'kitchen', label: 'Kitchen Tracker', sub: 'Inventory', icon: <Package size={18} /> },
      { id: 'orders', label: 'Order Desk', sub: 'Sales & Processing', icon: <ClipboardList size={18} /> },
      { id: 'finance', label: 'Financial Register', sub: 'Analytics', icon: <Wallet size={18} /> },
    ],
    []
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <aside className="lg:w-64 w-full bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex lg:flex-col">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-100 lg:border-b-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
            <ChefHat size={22} />
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 leading-tight">BiteSize ERP</h1>
            <p className="text-xs text-slate-400">Cloud kitchen ops</p>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
          >
            <LogOut size={17} />
          </button>
        </div>

        <nav className="flex lg:flex-col flex-1 lg:p-3 lg:gap-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={classNames(
                  'flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 lg:px-4 lg:py-3 lg:rounded-xl text-left transition-all',
                  active
                    ? 'bg-amber-50 text-amber-700 lg:ring-1 lg:ring-amber-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                )}
              >
                <span
                  className={classNames(
                    'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                    active ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
                  )}
                >
                  {item.icon}
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-xs text-slate-400">{item.sub}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block p-4 mt-auto space-y-3">
          <div className="bg-slate-50 rounded-xl p-3.5 ring-1 ring-slate-100">
            <p className="text-xs text-slate-400">Open orders</p>
            <p className="text-lg font-bold text-slate-700">{orders.length}</p>
          </div>
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-sm shrink-0">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{admin.name}</p>
              <p className="text-xs text-slate-400 truncate">{admin.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Log out"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 sm:p-8 max-w-6xl mx-auto w-full">
        {activeTab === 'kitchen' && <KitchenTracker inventory={inventory} onRestock={handleRestock} />}
        {activeTab === 'orders' && (
          <OrderDesk
            orders={orders}
            inventory={inventory}
            onFulfill={handleFulfill}
            onNewOrder={() => setIsNewOrderOpen(true)}
          />
        )}
        {activeTab === 'finance' && (
          <FinancialRegister revenue={totalRevenue} cost={totalCost} salesHistory={salesHistory} />
        )}
      </main>

      {isNewOrderOpen && (
        <NewOrderModal
          inventory={inventory}
          onClose={() => setIsNewOrderOpen(false)}
          onCreate={handleCreateOrder}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [admins, setAdmins] = useState(seedAdmins);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [authToast, setAuthToast] = useState(null);

  const handleLogin = (admin) => {
    setCurrentAdmin(admin);
  };

  const handleSignup = (newAdmin) => {
    setAdmins((prev) => [...prev, newAdmin]);
    setCurrentAdmin(newAdmin);
    setAuthToast(`Welcome, ${newAdmin.name}! Your admin account is ready.`);
    setTimeout(() => setAuthToast(null), 2500);
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
  };

  if (!currentAdmin) {
    return <AuthScreen admins={admins} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  return (
    <>
      <Dashboard admin={currentAdmin} onLogout={handleLogout} />
      {authToast && (
        <div className="fixed bottom-5 right-5 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          {authToast}
        </div>
      )}
    </>
  );
}
