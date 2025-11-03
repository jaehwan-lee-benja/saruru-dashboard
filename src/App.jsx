import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

function App() {
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [expandedHistoryId, setExpandedHistoryId] = useState(null)
  const [loading, setLoading] = useState(true)

  // 날짜 포맷팅 함수
  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 히스토리 토글
  const toggleHistory = (id) => {
    setExpandedHistoryId(expandedHistoryId === id ? null : id)
  }

  // Supabase에서 목표 불러오기
  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setGoals(data || [])
    } catch (error) {
      console.error('목표 불러오기 실패:', error)
      alert('목표를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 목표 추가
  const addGoal = async () => {
    if (newGoal.trim()) {
      try {
        const goal = {
          id: Date.now(),
          text: newGoal,
          edit_history: []
        }

        const { error } = await supabase
          .from('goals')
          .insert([goal])

        if (error) throw error

        setNewGoal('')
        fetchGoals()
      } catch (error) {
        console.error('목표 추가 실패:', error)
        alert('목표를 추가하는데 실패했습니다.')
      }
    }
  }

  // 목표 삭제
  const deleteGoal = async (id) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      fetchGoals()
    } catch (error) {
      console.error('목표 삭제 실패:', error)
      alert('목표를 삭제하는데 실패했습니다.')
    }
  }

  // 수정 시작
  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditingText(goal.text)
  }

  // 수정 저장
  const saveEdit = async () => {
    try {
      const goal = goals.find(g => g.id === editingId)
      if (!goal) return

      const historyEntry = {
        previousText: goal.text,
        editedAt: new Date().toISOString()
      }

      const { error } = await supabase
        .from('goals')
        .update({
          text: editingText,
          edit_history: [...(goal.edit_history || []), historyEntry]
        })
        .eq('id', editingId)

      if (error) throw error

      setEditingId(null)
      setEditingText('')
      fetchGoals()
    } catch (error) {
      console.error('목표 수정 실패:', error)
      alert('목표를 수정하는데 실패했습니다.')
    }
  }

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  return (
    <div className="container">
      <h1>사르르목장 대시보드</h1>
      <h2>목표 관리</h2>

      {/* 새 목표 입력 */}
      <div className="input-section">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          placeholder="새로운 목표를 입력하세요..."
        />
        <button onClick={addGoal}>추가</button>
      </div>

      {/* 목표 목록 */}
      <div className="goals-list">
        {loading ? (
          <p className="empty-message">로딩 중...</p>
        ) : goals.length === 0 ? (
          <p className="empty-message">아직 목표가 없습니다. 첫 목표를 추가해보세요!</p>
        ) : (
          goals.map(goal => (
            <div key={goal.id} className="goal-item">
              {editingId === goal.id ? (
                // 수정 모드
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  />
                  <button onClick={saveEdit}>저장</button>
                  <button onClick={cancelEdit}>취소</button>
                </div>
              ) : (
                // 일반 모드
                <>
                  <div className="view-mode">
                    <div className="goal-content">
                      <span className="goal-text">{goal.text}</span>
                      <span className="goal-date">생성일: {formatDate(goal.created_at)}</span>
                      {goal.edit_history && goal.edit_history.length > 0 && (
                        <button
                          className="history-toggle"
                          onClick={() => toggleHistory(goal.id)}
                        >
                          {expandedHistoryId === goal.id ? '히스토리 숨기기' : `수정 히스토리 (${goal.edit_history.length})`}
                        </button>
                      )}
                    </div>
                    <div className="button-group">
                      <button onClick={() => startEdit(goal)}>수정</button>
                      <button onClick={() => deleteGoal(goal.id)}>삭제</button>
                    </div>
                  </div>

                  {/* 수정 히스토리 */}
                  {expandedHistoryId === goal.id && goal.edit_history && goal.edit_history.length > 0 && (
                    <div className="edit-history">
                      <h4>수정 히스토리</h4>
                      {goal.edit_history.map((entry, index) => (
                        <div key={index} className="history-entry">
                          <div className="history-date">{formatDate(entry.editedAt)}</div>
                          <div className="history-text">이전 내용: {entry.previousText}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
