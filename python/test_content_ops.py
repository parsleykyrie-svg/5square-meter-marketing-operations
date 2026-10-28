import copy
import json
from pathlib import Path
import unittest
from content_ops import build_plan, campaign_report, csv_report

class ContentOpsTests(unittest.TestCase):
    def setUp(self):
        self.data=json.loads(Path(__file__).with_name('demo.json').read_text())

    def test_routing_keeps_audiences_and_markets_separate(self):
        plan=build_plan(self.data)
        self.assertEqual(plan[0]['handoff'][-2:],['linkedin-content','human-review'])
        self.assertEqual(plan[1]['audience'],'broker')
        self.assertEqual(plan[0]['languages'],['English','Georgian'])
        self.assertEqual(plan[2]['languages'],['English'])

    def test_source_presence_is_not_treated_as_verification(self):
        data=copy.deepcopy(self.data)
        data['briefs'][0]['sources']=['https://example.com/unreviewed']
        plan=build_plan(data)
        self.assertEqual(plan[0]['research_status'],'sources-supplied-review-required')
        self.assertTrue(all(p['publication_status']=='draft' for p in plan))
        self.assertEqual(plan[1]['research_status'],'research-needed')

    def test_metrics_and_zero_denominators(self):
        rows=campaign_report(self.data)
        self.assertEqual(rows[0]['cpl_usd'],40)
        self.assertEqual(rows[1]['ctr_percent'],1.5)
        self.assertIsNone(rows[2]['cpl_usd'])
        self.data['campaigns'][0].update(impressions=0,clicks=0,leads=0)
        row=campaign_report(self.data)[0]
        self.assertIsNone(row['ctr_percent']);self.assertIsNone(row['cpc_usd'])

    def test_invalid_inputs_are_rejected(self):
        self.data['briefs'][0]['audience']='everyone'
        with self.assertRaises(ValueError):build_plan(self.data)
        self.data['campaigns'][0]['spend']=-1
        with self.assertRaises(ValueError):campaign_report(self.data)

    def test_export_is_formula_safe_and_inputs_unchanged(self):
        original=copy.deepcopy(self.data)
        build_plan(self.data);campaign_report(self.data)
        self.assertEqual(self.data,original)
        self.assertIn("'=SUM",csv_report([{'name':'=SUM(1,2)','spend':5}]))

if __name__=='__main__':unittest.main()
