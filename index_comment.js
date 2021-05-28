(function() {

  // ゲーム内ローカル変数
  const state = {}

  // 問題のリストが返ってくるjson api
  const api = ''

  // htmlから要素を取得（vanillaはこれが面倒）

  // 「Start」がクリックされたら、fetchでapiを叩く > state.jsonDataにデータを格納 > 問題を設置
  const gameStart = () => {}

  // 問題と選択肢と、挑戦中の賞金を表示
  const setQuestion = () => {
    // 次の問題を表示するため、現在の問題数へ＋１を加算

    // 正解画面が表示状態だった場合、非表示とする

    // 問題文の設置

    // 選択肢の設置

    // 挑戦中の賞金を設置

  }

  // 選択肢から選択した答えをセット（ファイナルアンサー確認画面）
  const setMyAnswer = e => {}

  // 上記で選択した答えをチェック
  const checkAnswer = () => {}

  // 考え直す
  const returnThink = () => {}

  // 次の問題へ行かずにゲームを終了
  const gameDropout = () => {}

  // 全問正解でゲームを終了
  const gameFinish = () => {}

  // トップへ戻ってゲーム情報をリセット
  const gameReset = () => {}

  // 各クリックイベント

})()
