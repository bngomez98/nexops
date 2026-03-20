# Automation Features Guide

## Quick Start: Using the New Portal Features

### For Homeowners: Posting a Request with AI Assistance

1. **Navigate to**: Dashboard → New Request
2. **Fill the form**:
   - **Title**: "Leaking kitchen faucet"
   - **Description**: "Water is dripping from under the sink, possibly a loose connection"
   - *AI will suggest: Category = "plumbing", Budget = "$300-$1000", Urgency = "high"*

3. **Review suggestions**:
   - Click the blue "Zap" button to accept category suggestion
   - Click "Use max" to set budget to suggested maximum
   - Submit the request

4. **Automatic matching**:
   - System automatically matches 3-5 plumbers
   - Contractors with highest match scores notified
   - If match score > 85%, project auto-assigned

### For Contractors: Smart Job Discovery

1. **View Available Jobs**: Dashboard shows jobs sorted by match score
2. **Review Match Score**: Indicates why you were recommended (skills, budget, capacity)
3. **Quick Claim**: One-click project claiming with capacity checks
4. **Stay Updated**: Auto-notifications on project status changes

---

## API Integration Guide

### 1. Smart Contractor Matching

**Trigger When**: Project is created by homeowner

```typescript
// Example: Called automatically after project creation
const response = await fetch('/api/automation/match-contractor', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ projectId: 'proj-123' })
})

const { matches, autoAssigned, message } = await response.json()
// matches: [{ contractor_id, email, full_name, match_score, active_projects, average_rating }]
// autoAssigned: boolean (true if score > 85%)
// message: string describing the result
```

**Response**:
```json
{
  "matches": [
    {
      "contractor_id": "cont-456",
      "email": "john@contractors.com",
      "full_name": "John Smith",
      "match_score": 92,
      "active_projects": 1,
      "average_rating": 4.8
    },
    { "match_score": 78, ... },
    { "match_score": 65, ... }
  ],
  "autoAssigned": true,
  "message": "Project automatically assigned to John Smith (92% match)"
}
```

---

### 2. Automated Status Updates

**Trigger When**: User clicks "Mark as In Progress" or "Mark Complete"

```typescript
// Example: Update project status
const response = await fetch('/api/automation/update-status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    projectId: 'proj-123',
    newStatus: 'in_progress',
    reason: 'Contractor started work on schedule'
  })
})

const result = await response.json()
// {
//   success: true,
//   projectId: 'proj-123',
//   previousStatus: 'assigned',
//   newStatus: 'in_progress',
//   timestamp: '2024-03-20T...'
// }
```

**Valid State Transitions**:
```
pending_review → [in_queue, declined]
in_queue → [assigned, declined]
assigned → [consultation_scheduled, declined]
consultation_scheduled → [in_progress, declined]
in_progress → [completed, declined]
completed → [] (terminal)
```

**Error Example**:
```json
{
  "error": "Invalid transition: completed → in_progress",
  "validTransitions": []
}
```

---

### 3. Smart Request Categorization

**Trigger When**: User types description (debounced 800ms)

```typescript
// Example: Get category suggestions
const response = await fetch('/api/automation/categorize-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Water leaking from faucet",
    description: "Kitchen sink faucet is dripping water at night..."
  })
})

const suggestions = await response.json()
// {
//   suggestedCategory: 'plumbing',
//   urgency: 'high',
//   urgencyLevel: 2,
//   estimatedBudgetRange: {
//     min: 300,
//     max: 1500,
//     mid: 900
//   },
//   confidence: 100,
//   categoryScores: {
//     plumbing: 3,
//     electrical: 0,
//     roofing: 0,
//     ...
//   }
// }
```

**Urgency Levels**:
- `urgent` (1): Emergency keywords (leak, flood, critical, emergency)
- `high` (2): Quick fix needed (soon, quickly, broken, damage)
- `normal` (3): Regular maintenance (repair, fix, maintenance)
- `low` (4): Future planning (inspection, estimate, consultation)

---

## UI Integration Examples

### Show Category Suggestion Button

```tsx
{suggestedCategory && !formData.category && (
  <button
    onClick={() => setFormData(prev => ({ 
      ...prev, 
      category: suggestedCategory 
    }))}
    className="px-3 py-2.5 rounded-lg border border-primary/40 bg-primary/5"
  >
    <Zap className="w-3.5 h-3.5 inline" />
    {suggestedCategory}
  </button>
)}
```

### Display Budget Recommendation

```tsx
{suggestedBudget && !formData.budget && (
  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
    <span className="font-semibold">Estimated: </span>
    <span>${suggestedBudget.min} – ${suggestedBudget.max}</span>
    <button onClick={() => applySuggestion('budget')}>Use max</button>
  </div>
)}
```

### Match Score Display (for contractors)

```tsx
{match.match_score >= 85 && (
  <div className="text-green-600 font-bold">
    Highly Recommended {match.match_score}%
  </div>
)}
{match.match_score >= 70 && (
  <div className="text-blue-600 font-semibold">
    Good Match {match.match_score}%
  </div>
)}
```

---

## Webhook Events (For Real-Time Updates)

*Future Enhancement*: Consider implementing webhooks for:

```
project.created → trigger matching
project.status_changed → notify stakeholders
contractor.available → notify matching
```

---

## Performance Considerations

### Caching Strategy
- **Contractor Profiles**: Cache for 1 hour (they rarely change)
- **Project Status**: Real-time (no caching)
- **Category Suggestions**: Client-side cache for same descriptions

### Rate Limits
- Matching API: 100 requests/minute per user
- Status API: Unlimited (business logic prevents abuse)
- Categorization API: 500 requests/minute per user

### Optimization Tips
1. Debounce categorization input (already done: 800ms)
2. Batch status updates when possible
3. Cache contractor profiles with TTL
4. Use database indexes on frequently queried fields

---

## Error Handling

### Common Errors

**Project Not Found**
```json
{ "error": "Project not found", "status": 404 }
```

**Invalid State Transition**
```json
{ 
  "error": "Invalid transition: completed → in_progress",
  "validTransitions": []
}
```

**Unauthorized Access**
```json
{ "error": "Not authorized", "status": 403 }
```

**Missing Parameters**
```json
{ "error": "projectId and newStatus are required", "status": 400 }
```

---

## Testing the APIs Locally

### Using cURL

```bash
# Test categorization
curl -X POST http://localhost:3000/api/automation/categorize-request \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Leaking roof",
    "description": "Water coming through ceiling during heavy rain"
  }'

# Test status update
curl -X POST http://localhost:3000/api/automation/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "test-proj-id",
    "newStatus": "in_progress",
    "reason": "Work started"
  }'
```

### Using Postman

1. Create new POST request
2. Set URL to automation endpoint
3. Copy JSON body from examples above
4. Send and review response

---

## Monitoring & Analytics

### Track Success Metrics

```sql
-- Success rate of auto-assignments
SELECT 
  COUNT(*) FILTER (WHERE match_score > 85) as auto_assigned,
  COUNT(*) as total_matches,
  ROUND(100.0 * COUNT(*) FILTER (WHERE match_score > 85) / COUNT(*), 2) as auto_assign_rate
FROM project_matches;

-- Average match score distribution
SELECT
  match_score_bracket,
  COUNT(*) as project_count
FROM (
  SELECT
    CASE 
      WHEN match_score >= 85 THEN 'excellent'
      WHEN match_score >= 70 THEN 'good'
      WHEN match_score >= 50 THEN 'fair'
      ELSE 'poor'
    END as match_score_bracket
  FROM project_matches
) grouped
GROUP BY match_score_bracket;
```

---

## Future Enhancements

1. **ML-Powered Matching**: Train model on successful/failed assignments
2. **Negotiation Window**: Let contractors counter-offer on projects
3. **Time Estimates**: AI estimates project duration based on description
4. **Risk Scoring**: Flag projects with high risk indicators
5. **Batch Operations**: Match multiple projects at once
6. **Historical Analytics**: Track matching patterns over time

---

## Support & Troubleshooting

**Q: Why wasn't my project auto-assigned?**
A: Match scores must exceed 85% threshold. Check the top contractor's score in response.

**Q: Can I manually override the suggested category?**
A: Yes, the suggestion is just a helper. Select from dropdown to choose different category.

**Q: What if a contractor disputes the status change?**
A: All changes are logged with reason/timestamp. Contact admin to review audit trail.

**Q: How do I see all projects I've been matched with?**
A: Check your Available Projects dashboard; all recommended jobs appear there.
