import Consumption from './components'

export default Consumption

export const chartPlotOptions = {
    'consumption': {"key":"consumption", 'label': 'Consumption', "unit":"kWh"},
    "cost": {"key":"cost", 'label': 'Cost', "unit":"p"},
    "rate": {"key":"rate", 'label': 'Rate', "unit":"p"},
    "avgCost": {"key":"avgCost", 'label': 'Average Unit Cost', "unit":"p/kWh"}
}

export const chartTypeOptions = {
    'avg': {'label': 'Average'},
    "actl": { 'label': 'Actual'}
}

export const chartViewOptions = {
    "hour": {'label': 'Hourly', 'avgStringFormat': "HH:mm", 'actlStringFormat': "DD MMM HH:mm"},
    "day": {'label': 'Daily', "avgStringFormat": "dddd", 'actlStringFormat': "YYYY-MM-DD"},
    "week": {'label': 'Weekly', "avgStringFormat": "ww YYYY", 'actlStringFormat': "ww YYYY"},
    "month": {'label': 'Monthly', "avgStringFormat": "MMMM", 'actlStringFormat': "MMM YYYY"}
}