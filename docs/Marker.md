# Marker - 地圖標記元件

> 本文件說明 Marker.tsx 元件的 UI 職責、生命週期管理、型別安全與與地圖互動最佳實踐

---

## <img src="./docIconImg/book-open-duotone.svg" width="20" height="20" align="center" /> Overview 功能概述

- Marker.tsx 負責在地圖上渲染自訂標記，顯示即時天氣資訊
- 使用 React Portal 將自訂 DOM 元素渲染到地圖上
- 生命週期安全，確保 marker 正確建立與清理

---

## <img src="./docIconImg/target-duotone.svg" width="20" height="20" align="center" /> Core Concepts 核心概念

### 1. React Portal

- 透過 createPortal 將 React 元素渲染到地圖 marker DOM

### 2. 生命週期管理

- useEffect 建立/移除 marker，防止記憶體洩漏
- markerRef 追蹤 marker 實例，確保座標更新時不重建

### 3. 型別安全

- map、coordinates、weather 等皆有明確型別

---

## <img src="./docIconImg/wrench-duotone.svg" width="20" height="20" align="center" /> Code Walkthrough 程式碼解析

```tsx
export const Marker = ({ map, coordinates }: Props) => {
  const { weather } = useWeather();
  const markerRef = useRef<MarkerType | null>(null);
  const markerElement = useMemo(() => {
    const el = document.createElement("div");
    el.className = "mapbox-marker-portal";
    return el;
  }, []);

  useEffect(() => {
    if (!map) return;
    const marker = new mapboxgl.Marker({ element: markerElement })
      .setLngLat(coordinates)
      .addTo(map);
    markerRef.current = marker;
    return () => {
      marker.remove();
      markerRef.current = null;
    };
  }, [map, markerElement]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat(coordinates);
    }
  }, [coordinates]);

  if (!weather) return null;
  return createPortal(<div>...天氣資訊...</div>, markerElement);
};
```

---

## <img src="./docIconImg/note-pencil-duotone.svg" width="20" height="20" align="center" /> Usage 使用方式

- 傳入 map 實例與座標，Marker 會自動渲染於地圖上
- weather 變動時自動更新內容

---

## <img src="./docIconImg/lightbulb-duotone.svg" width="20" height="20" align="center" /> Key Points 重點總結

- React Portal 實現地圖自訂標記
- 生命週期安全，避免記憶體洩漏
- 型別明確，易於維護

---

## <img src="./docIconImg/rocket-duotone.svg" width="20" height="20" align="center" /> Advanced Topics 進階概念

- 可擴充 marker 內容（如多種天氣資訊、互動功能）
- 建議所有地圖副作用都集中於 useEffect，維持元件純粹
