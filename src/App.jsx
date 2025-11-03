import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [expandedHistoryId, setExpandedHistoryId] = useState(null)

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

  // localStorage에서 목표 불러오기
  useEffect(() => {
    const savedGoals = localStorage.getItem('saruru-goals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  // 목표 변경시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('saruru-goals', JSON.stringify(goals))
  }, [goals])

  // 목표 추가
  const addGoal = () => {
    if (newGoal.trim()) {
      const goal = {
        id: Date.now(),
        text: newGoal,
        createdAt: new Date().toISOString(),
        editHistory: []
      }
      setGoals([...goals, goal])
      setNewGoal('')
    }
  }

  // 목표 삭제
  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  // 수정 시작
  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditingText(goal.text)
  }

  // 수정 저장
  const saveEdit = () => {
    setGoals(goals.map(goal => {
      if (goal.id === editingId) {
        const historyEntry = {
          previousText: goal.text,
          editedAt: new Date().toISOString()
        }
        return {
          ...goal,
          text: editingText,
          editHistory: [...(goal.editHistory || []), historyEntry]
        }
      }
      return goal
    }))
    setEditingId(null)
    setEditingText('')
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
        {goals.length === 0 ? (
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
                      <span className="goal-date">생성일: {formatDate(goal.createdAt)}</span>
                      {goal.editHistory && goal.editHistory.length > 0 && (
                        <button
                          className="history-toggle"
                          onClick={() => toggleHistory(goal.id)}
                        >
                          {expandedHistoryId === goal.id ? '히스토리 숨기기' : `수정 히스토리 (${goal.editHistory.length})`}
                        </button>
                      )}
                    </div>
                    <div className="button-group">
                      <button onClick={() => startEdit(goal)}>수정</button>
                      <button onClick={() => deleteGoal(goal.id)}>삭제</button>
                    </div>
                  </div>

                  {/* 수정 히스토리 */}
                  {expandedHistoryId === goal.id && goal.editHistory && goal.editHistory.length > 0 && (
                    <div className="edit-history">
                      <h4>수정 히스토리</h4>
                      {goal.editHistory.map((entry, index) => (
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
